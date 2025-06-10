import { ApiResponse } from '../../shared/types';
import { ProductService } from '../services/product.service';
import { InventoryService } from '../services/inventory.service';

export interface ProductImage {
    image_url: string;
    is_primary: boolean;
}

export interface ProductAttribute {
    name: string;
    value: string;
}

export interface AddProductRequest {
    name: string;
    description: string;
    price: number;
    category_id: number;
    sku: string;
    initial_stock: number;
    low_stock_threshold?: number;
    images?: ProductImage[];
    attributes?: ProductAttribute[];
}

export interface AddProductResponse {
    product_id: number;
    status: string;
    message: string;
}

export class AddProductFunction {
    private productService: ProductService;
    private inventoryService: InventoryService;

    constructor(
        productService: ProductService = new ProductService(),
        inventoryService: InventoryService = new InventoryService()
    ) {
        this.productService = productService;
        this.inventoryService = inventoryService;
    }

    async execute(request: AddProductRequest): Promise<ApiResponse<AddProductResponse>> {
        try {
            // Validate request
            this.validateRequest(request);

            // Check if SKU already exists
            const existingSku = await this.productService.findBySku(request.sku);
            if (existingSku) {
                return {
                    status: 'error',
                    message: 'SKU already exists',
                    error: {
                        code: 'DUPLICATE_SKU'
                    }
                };
            }

            // Create product
            const product = await this.productService.createProduct({
                name: request.name,
                description: request.description,
                price: request.price,
                category_id: request.category_id,
                sku: request.sku
            });

            // Initialize inventory
            await this.inventoryService.initializeInventory({
                product_id: product.id,
                quantity: request.initial_stock,
                low_stock_threshold: request.low_stock_threshold
            });

            // Add images if provided
            if (request.images && request.images.length > 0) {
                await this.productService.addProductImages(product.id, request.images);
            }

            // Add attributes if provided
            if (request.attributes && request.attributes.length > 0) {
                await this.productService.addProductAttributes(product.id, request.attributes);
            }

            // Return success response
            return {
                status: 'success',
                data: {
                    product_id: product.id,
                    status: 'success',
                    message: 'Product successfully created'
                }
            };

        } catch (error) {
            console.error('Error in AddProductFunction:', error);
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

    private validateRequest(request: AddProductRequest): void {
        const errors: string[] = [];

        if (!request.name?.trim()) {
            errors.push('Name is required');
        }

        if (!request.description?.trim()) {
            errors.push('Description is required');
        }

        if (typeof request.price !== 'number' || request.price <= 0) {
            errors.push('Price must be a positive number');
        }

        if (!request.sku?.trim()) {
            errors.push('SKU is required');
        }

        if (typeof request.initial_stock !== 'number' || request.initial_stock < 0) {
            errors.push('Initial stock must be a non-negative number');
        }

        if (request.low_stock_threshold !== undefined && 
            (typeof request.low_stock_threshold !== 'number' || request.low_stock_threshold < 0)) {
            errors.push('Low stock threshold must be a non-negative number');
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
    }
}