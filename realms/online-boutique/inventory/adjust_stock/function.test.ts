import { AdjustStockFunction, AdjustStockRequest } from './function';
import { MockProductService } from '../__mocks__/product.service.mock';
import { MockInventoryService } from '../__mocks__/inventory.service.mock';

// Mock the OrdersClient
class MockOrdersClient {
    private shouldHavePendingOrders: boolean = false;

    async checkStockAvailability({ product_id, quantity }: { product_id: number, quantity: number }) {
        return {
            has_pending_orders: this.shouldHavePendingOrders,
            pending_orders: this.shouldHavePendingOrders ? [{ order_id: '123', quantity: 5 }] : []
        };
    }

    __setShouldHavePendingOrders(value: boolean) {
        this.shouldHavePendingOrders = value;
    }
}

describe('AdjustStockFunction', () => {
    let adjustStockFunction: AdjustStockFunction;
    let mockProductService: MockProductService;
    let mockInventoryService: MockInventoryService;
    let mockOrdersClient: MockOrdersClient;

    beforeEach(() => {
        mockProductService = new MockProductService();
        mockInventoryService = new MockInventoryService();
        mockOrdersClient = new MockOrdersClient();
        adjustStockFunction = new AdjustStockFunction(
            mockInventoryService,
            mockProductService,
            mockOrdersClient as any
        );

        // Set up initial product and inventory
        const product = {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category_id: 1,
            sku: 'TEST-001',
            created_at: new Date(),
            updated_at: new Date()
        };
        mockProductService.__addProduct(product);

        const inventory = {
            id: 1,
            product_id: 1,
            quantity: 100,
            low_stock_threshold: 10,
            last_restock_date: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };
        mockInventoryService.__setInventory(inventory);
    });

    const validRequest: AdjustStockRequest = {
        product_id: 1,
        quantity_change: -10,
        reason: 'sale',
        notes: 'Test adjustment'
    };

    describe('input validation', () => {
        it('should validate required fields', async () => {
            const invalidRequest = { ...validRequest, product_id: undefined };
            const result = await adjustStockFunction.execute(invalidRequest as any);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Valid product_id is required');
        });

        it('should validate reason enum values', async () => {
            const invalidRequest = { ...validRequest, reason: 'invalid' };
            const result = await adjustStockFunction.execute(invalidRequest as any);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Invalid reason provided');
        });
    });

    describe('business logic', () => {
        it('should successfully adjust stock for valid increase', async () => {
            const request = { ...validRequest, quantity_change: 10 };
            const result = await adjustStockFunction.execute(request);
            
            expect(result.status).toBe('success');
            expect(result.data?.new_quantity).toBe(110);
        });

        it('should successfully adjust stock for valid decrease', async () => {
            const result = await adjustStockFunction.execute(validRequest);
            
            expect(result.status).toBe('success');
            expect(result.data?.new_quantity).toBe(90);
        });

        it('should prevent negative inventory', async () => {
            const request = { ...validRequest, quantity_change: -150 };
            const result = await adjustStockFunction.execute(request);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('negative inventory');
        });

        it('should check pending orders for stock reduction', async () => {
            mockOrdersClient.__setShouldHavePendingOrders(true);
            const result = await adjustStockFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('pending orders exist');
        });

        it('should emit low stock alert when threshold is reached', async () => {
            const request = { ...validRequest, quantity_change: -95 }; // Will reduce to 5 units
            const result = await adjustStockFunction.execute(request);
            
            expect(result.status).toBe('success');
            const alerts = mockInventoryService.__getAlerts();
            expect(alerts.length).toBe(1);
            expect(alerts[0].current_quantity).toBe(5);
        });
    });

    describe('error handling', () => {
        it('should handle non-existent product', async () => {
            const request = { ...validRequest, product_id: 999 };
            const result = await adjustStockFunction.execute(request);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Product not found');
        });

        it('should handle inventory service errors', async () => {
            jest.spyOn(mockInventoryService, 'adjustStock').mockRejectedValue(new Error('Database error'));
            
            const result = await adjustStockFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.error?.code).toBe('INTERNAL_ERROR');
        });

        it('should handle orders client errors', async () => {
            jest.spyOn(mockOrdersClient, 'checkStockAvailability').mockRejectedValue(new Error('Service error'));
            
            const result = await adjustStockFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.error?.code).toBe('INTERNAL_ERROR');
        });
    });
});