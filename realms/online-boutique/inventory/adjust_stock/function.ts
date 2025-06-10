import { ApiResponse } from '../../shared/types';
import { InventoryService } from '../services/inventory.service';
import { ProductService } from '../services/product.service';
import { OrdersClient } from '../../clients/orders/check_stock_availability/index'; // This will be generated

export interface AdjustStockRequest {
    product_id: number;
    quantity_change: number;
    reason: 'restock' | 'sale' | 'damage' | 'audit';
    notes?: string;
}

export interface AdjustStockResponse {
    status: string;
    message: string;
    new_quantity: number;
    adjustment_id: number;
}

export class AdjustStockFunction {
    private inventoryService: InventoryService;
    private productService: ProductService;
    private ordersClient: OrdersClient;

    constructor(
        inventoryService: InventoryService = new InventoryService(),
        productService: ProductService = new ProductService(),
        ordersClient: OrdersClient = new OrdersClient({
            BASE: process.env.ORDERS_SERVICE_URL || 'http://localhost:3001'
        })
    ) {
        this.inventoryService = inventoryService;
        this.productService = productService;
        this.ordersClient = ordersClient;
    }

    async execute(request: AdjustStockRequest): Promise<ApiResponse<AdjustStockResponse>> {
        try {
            // Validate request
            this.validateRequest(request);

            // Check if product exists
            const product = await this.productService.findById(request.product_id);
            if (!product) {
                return {
                    status: 'error',
                    message: 'Product not found',
                    error: {
                        code: 'PRODUCT_NOT_FOUND'
                    }
                };
            }

            // Get current inventory
            const currentInventory = await this.inventoryService.getInventory(request.product_id);
            if (!currentInventory) {
                return {
                    status: 'error',
                    message: 'Inventory record not found',
                    error: {
                        code: 'INVENTORY_NOT_FOUND'
                    }
                };
            }

            // Check if adjustment would result in negative stock
            const newQuantity = currentInventory.quantity + request.quantity_change;
            if (newQuantity < 0) {
                return {
                    status: 'error',
                    message: 'Stock adjustment would result in negative inventory',
                    error: {
                        code: 'INVALID_QUANTITY'
                    }
                };
            }

            // If this is a stock reduction, check for pending orders
            if (request.quantity_change < 0) {
                const pendingOrdersCheck = await this.ordersClient.checkStockAvailability({
                    product_id: request.product_id,
                    quantity: Math.abs(request.quantity_change)
                });

                if (pendingOrdersCheck.has_pending_orders) {
                    return {
                        status: 'error',
                        message: 'Cannot reduce stock: pending orders exist',
                        error: {
                            code: 'PENDING_ORDERS_EXIST',
                            details: pendingOrdersCheck.pending_orders
                        }
                    };
                }
            }

            // Perform the adjustment
            const adjustment = await this.inventoryService.adjustStock({
                product_id: request.product_id,
                quantity_change: request.quantity_change,
                reason: request.reason,
                notes: request.notes
            });

            // Check if new quantity is below threshold and emit alert if needed
            if (currentInventory.low_stock_threshold && newQuantity <= currentInventory.low_stock_threshold) {
                await this.inventoryService.emitLowStockAlert({
                    product_id: request.product_id,
                    current_quantity: newQuantity,
                    threshold: currentInventory.low_stock_threshold
                });
            }

            // Return success response
            return {
                status: 'success',
                data: {
                    status: 'success',
                    message: 'Stock adjusted successfully',
                    new_quantity: newQuantity,
                    adjustment_id: adjustment.id
                }
            };

        } catch (error) {
            console.error('Error in AdjustStockFunction:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Internal server error',
                error: {
                    code: 'INTERNAL_ERROR',
                    details: error
                }
            };
        }
    }

    private validateRequest(request: AdjustStockRequest): void {
        const errors: string[] = [];

        if (!request.product_id || typeof request.product_id !== 'number') {
            errors.push('Valid product_id is required');
        }

        if (typeof request.quantity_change !== 'number') {
            errors.push('quantity_change must be a number');
        }

        if (!['restock', 'sale', 'damage', 'audit'].includes(request.reason)) {
            errors.push('Invalid reason provided');
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
    }
}