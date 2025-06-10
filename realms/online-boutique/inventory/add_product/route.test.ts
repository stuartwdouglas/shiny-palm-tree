import express from 'express';
import request from 'supertest';
import addProductRouter from './route';
import { AddProductFunction } from './function';

jest.mock('./function');

describe('Add Product Route', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/inventory', addProductRouter);
    });

    const validRequest = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category_id: 1,
        sku: 'TEST-001',
        initial_stock: 100
    };

    it('should return 201 for successful product creation', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                product_id: 1,
                status: 'success',
                message: 'Product successfully created'
            }
        };

        (AddProductFunction.prototype.execute as jest.Mock).mockResolvedValue(mockResponse);

        const response = await request(app)
            .post('/api/v1/inventory/products')
            .send(validRequest)
            .expect(201);

        expect(response.body).toEqual(mockResponse);
    });

    it('should return 400 for invalid input', async () => {
        const mockResponse = {
            status: 'error',
            message: 'Validation failed',
            error: {
                code: 'VALIDATION_ERROR'
            }
        };

        (AddProductFunction.prototype.execute as jest.Mock).mockResolvedValue(mockResponse);

        const response = await request(app)
            .post('/api/v1/inventory/products')
            .send({})
            .expect(400);

        expect(response.body).toEqual(mockResponse);
    });

    it('should return 500 for internal errors', async () => {
        (AddProductFunction.prototype.execute as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/v1/inventory/products')
            .send(validRequest)
            .expect(500);

        expect(response.body.status).toBe('error');
        expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });
});