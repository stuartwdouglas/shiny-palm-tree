import express from 'express';
import request from 'supertest';
import adjustStockRouter from './route';
import { AdjustStockFunction } from './function';

jest.mock('./function');

describe('Adjust Stock Route', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/inventory', adjustStockRouter);
    });

    const validRequest = {
        product_id: 1,
        quantity_change: -10,
        reason: 'sale',
        notes: 'Test adjustment'
    };

    it('should return 200 for successful stock adjustment', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                status: 'success',
                message: 'Stock adjusted successfully',
                new_quantity: 90,
                adjustment_id: 1
            }
        };

        (AdjustStockFunction.prototype.execute as jest.Mock).mockResolvedValue(mockResponse);

        const response = await request(app)
            .post('/api/v1/inventory/stock/adjust')
            .send(validRequest)
            .expect(200);

        expect(response.body).toEqual(mockResponse);
    });

    it('should return 404 for non-existent product', async () => {
        const mockResponse = {
            status: 'error',
            message: 'Product not found',
            error: {
                code: 'PRODUCT_NOT_FOUND'
            }
        };

        (AdjustStockFunction.prototype.execute as jest.Mock).mockResolvedValue(mockResponse);

        const response = await request(app)
            .post('/api/v1/inventory/stock/adjust')
            .send({ ...validRequest, product_id: 999 })
            .expect(404);

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

        (AdjustStockFunction.prototype.execute as jest.Mock).mockResolvedValue(mockResponse);

        const response = await request(app)
            .post('/api/v1/inventory/stock/adjust')
            .send({})
            .expect(400);

        expect(response.body).toEqual(mockResponse);
    });

    it('should return 500 for internal errors', async () => {
        (AdjustStockFunction.prototype.execute as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/v1/inventory/stock/adjust')
            .send(validRequest)
            .expect(500);

        expect(response.body.status).toBe('error');
        expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });
});