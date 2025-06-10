import { Router, Request, Response } from 'express';
import { AddProductFunction, AddProductRequest } from './function';

const router = Router();

router.post('/products', async (req: Request, res: Response) => {
    const addProductFunction = new AddProductFunction();
    
    try {
        const request: AddProductRequest = req.body;
        const result = await addProductFunction.execute(request);
        
        if (result.status === 'success') {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
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