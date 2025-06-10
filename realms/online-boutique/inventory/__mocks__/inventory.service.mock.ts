import { 
    Inventory, 
    InitializeInventoryData, 
    AdjustStockData, 
    StockAdjustment,
    LowStockAlert 
} from '../services/inventory.service';

export class MockInventoryService {
    private inventory: Map<number, Inventory> = new Map();
    private adjustments: StockAdjustment[] = [];
    private alerts: LowStockAlert[] = [];
    private nextId = 1;

    async initializeInventory(data: InitializeInventoryData): Promise<Inventory> {
        const inventory: Inventory = {
            id: this.nextId++,
            product_id: data.product_id,
            quantity: data.quantity,
            low_stock_threshold: data.low_stock_threshold || null,
            last_restock_date: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };

        this.inventory.set(data.product_id, inventory);
        return inventory;
    }

    async getInventory(productId: number): Promise<Inventory | null> {
        return this.inventory.get(productId) || null;
    }

    async adjustStock(data: AdjustStockData): Promise<StockAdjustment> {
        const inventory = this.inventory.get(data.product_id);
        if (!inventory) {
            throw new Error('Inventory not found');
        }

        const newQuantity = inventory.quantity + data.quantity_change;
        if (newQuantity < 0) {
            throw new Error('Insufficient stock');
        }

        inventory.quantity = newQuantity;
        if (data.quantity_change > 0) {
            inventory.last_restock_date = new Date();
        }

        const adjustment: StockAdjustment = {
            id: this.nextId++,
            product_id: data.product_id,
            quantity_changed: data.quantity_change,
            new_quantity: newQuantity,
            reason: data.reason,
            notes: data.notes,
            created_at: new Date()
        };

        this.adjustments.push(adjustment);
        return adjustment;
    }

    async emitLowStockAlert(alert: LowStockAlert): Promise<void> {
        this.alerts.push(alert);
    }

    // Test helper methods
    __reset() {
        this.inventory.clear();
        this.adjustments = [];
        this.alerts = [];
        this.nextId = 1;
    }

    __getAlerts(): LowStockAlert[] {
        return [...this.alerts];
    }

    __getAdjustments(): StockAdjustment[] {
        return [...this.adjustments];
    }

    __setInventory(inventory: Inventory) {
        this.inventory.set(inventory.product_id, inventory);
    }
}