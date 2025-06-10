import { AddProductFunction, AddProductRequest } from './function';
import { MockProductService } from '../__mocks__/product.service.mock';
import { MockInventoryService } from '../__mocks__/inventory.service.mock';

describe('AddProductFunction', () => {
    let addProductFunction: AddProductFunction;
    let mockProductService: MockProductService;
    let mockInventoryService: MockInventoryService;

    beforeEach(() => {
        mockProductService = new MockProductService();
        mockInventoryService = new MockInventoryService();
        addProductFunction = new AddProductFunction(mockProductService, mockInventoryService);
    });

    const validRequest: AddProductRequest = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category_id: 1,
        sku: 'TEST-001',
        initial_stock: 100,
        low_stock_threshold: 10,
        images: [
            { image_url: 'http://example.com/image.jpg', is_primary: true }
        ],
        attributes: [
            { name: 'color', value: 'red' }
        ]
    };

    describe('input validation', () => {
        it('should validate required fields', async () => {
            const invalidRequest = { ...validRequest, name: '' };
            const result = await addProductFunction.execute(invalidRequest);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Name is required');
        });

        it('should validate price is positive', async () => {
            const invalidRequest = { ...validRequest, price: -10 };
            const result = await addProductFunction.execute(invalidRequest);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Price must be a positive number');
        });

        it('should validate initial stock is non-negative', async () => {
            const invalidRequest = { ...validRequest, initial_stock: -1 };
            const result = await addProductFunction.execute(invalidRequest);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('Initial stock must be a non-negative number');
        });
    });

    describe('business logic', () => {
        it('should successfully create a product with all details', async () => {
            const result = await addProductFunction.execute(validRequest);
            
            expect(result.status).toBe('success');
            expect(result.data?.product_id).toBeDefined();
            expect(result.data?.status).toBe('success');
        });

        it('should prevent duplicate SKUs', async () => {
            // First creation
            await addProductFunction.execute(validRequest);
            
            // Second creation with same SKU
            const result = await addProductFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.message).toContain('SKU already exists');
        });

        it('should emit low stock alert when initial stock is below threshold', async () => {
            const request = { ...validRequest, initial_stock: 5, low_stock_threshold: 10 };
            await addProductFunction.execute(request);
            
            const alerts = mockInventoryService.__getAlerts();
            expect(alerts.length).toBe(1);
            expect(alerts[0].current_quantity).toBe(5);
            expect(alerts[0].threshold).toBe(10);
        });

        it('should not emit low stock alert when initial stock is above threshold', async () => {
            const request = { ...validRequest, initial_stock: 20, low_stock_threshold: 10 };
            await addProductFunction.execute(request);
            
            const alerts = mockInventoryService.__getAlerts();
            expect(alerts.length).toBe(0);
        });
    });

    describe('error handling', () => {
        it('should handle product service errors gracefully', async () => {
            jest.spyOn(mockProductService, 'createProduct').mockRejectedValue(new Error('Database error'));
            
            const result = await addProductFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.error?.code).toBe('INTERNAL_ERROR');
        });

        it('should handle inventory service errors gracefully', async () => {
            jest.spyOn(mockInventoryService, 'initializeInventory').mockRejectedValue(new Error('Database error'));
            
            const result = await addProductFunction.execute(validRequest);
            
            expect(result.status).toBe('error');
            expect(result.error?.code).toBe('INTERNAL_ERROR');
        });
    });
});