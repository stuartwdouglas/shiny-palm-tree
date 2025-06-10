import { Product, CreateProductData } from '../services/product.service';
import { ProductImage, ProductAttribute } from '../add_product/function';

export class MockProductService {
    private products: Map<number, Product> = new Map();
    private skus: Set<string> = new Set();
    private nextId = 1;

    async findById(id: number): Promise<Product | null> {
        return this.products.get(id) || null;
    }

    async findBySku(sku: string): Promise<Product | null> {
        for (const product of this.products.values()) {
            if (product.sku === sku) {
                return product;
            }
        }
        return null;
    }

    async createProduct(data: CreateProductData): Promise<Product> {
        if (this.skus.has(data.sku)) {
            throw new Error('SKU already exists');
        }

        const product: Product = {
            id: this.nextId++,
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        };

        this.products.set(product.id, product);
        this.skus.add(data.sku);
        return product;
    }

    async addProductImages(productId: number, images: ProductImage[]): Promise<void> {
        if (!this.products.has(productId)) {
            throw new Error('Product not found');
        }
        // In a real implementation, we would store the images
    }

    async addProductAttributes(productId: number, attributes: ProductAttribute[]): Promise<void> {
        if (!this.products.has(productId)) {
            throw new Error('Product not found');
        }
        // In a real implementation, we would store the attributes
    }

    // Test helper methods
    __reset() {
        this.products.clear();
        this.skus.clear();
        this.nextId = 1;
    }

    __addProduct(product: Product) {
        this.products.set(product.id, product);
        this.skus.add(product.sku);
    }
}