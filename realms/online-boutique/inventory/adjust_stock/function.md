# Adjust Stock Function

## Description
Adjusts the inventory level for a product, either increasing or decreasing the available quantity.

## Inputs
- product_id: integer (required) - ID of the product
- quantity_change: integer (required) - Amount to adjust (positive for increase, negative for decrease)
- reason: string (required) - Reason for adjustment ('restock', 'sale', 'damage', 'audit')
- notes: string (optional) - Additional notes about the adjustment

## Outputs
- status: string - Success/failure status
- message: string - Success/error message
- new_quantity: integer - Updated stock level
- adjustment_id: integer - ID of the adjustment record

## Events Generated
- STOCK_ADJUSTED
- LOW_STOCK_ALERT (if threshold reached)
- OUT_OF_STOCK_ALERT (if stock reaches 0)