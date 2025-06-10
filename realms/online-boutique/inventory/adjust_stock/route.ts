import { Router, Request, Response } from 'express';
import { AdjustStockFunction, AdjustStockRequest } from './function';

const router = Router();

router.post('/stock/adjust', async (req: Request, res: Response) => {
    const adjustStockFunction = new AdjustStockFunction();
    
    try {
        const request: AdjustStockRequest = req.body;
        const result = await adjustStockFunction.execute(request);
        
        if (result.status === 'success') {
            res.status(200).json(result);
        } else {
            const statusCode = result.error?.code === 'PRODUCT_NOT_FOUND' ? 404 : 400;
            res.status(statusCode).json(result);
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: {
                code: 'INTERNAL_ERROR',
                details: error instanceof Error ? error.message : 'Unknown error'
            }
        });
    }
});

export default router;