# Modify Order Function

## Description
Modifies an existing order before it has been fulfilled.

## Inputs
- order_id: string (required) - Order identifier
- modification_type: string (required) - Type of modification ('update_quantity', 'change_shipping', 'change_address')
- modification_details: object {
    item_id: integer,
    new_quantity: integer,
    new_shipping_method: integer,
    new_address: object
  }
- reason: string (required) - Reason for modification

## Outputs
- status: string - Success/failure status
- message: string - Success/error message
- updated_order: object - Updated order details
- price_adjustment: decimal - Any price changes

## Events Generated
- ORDER_MODIFIED
- PRICE_ADJUSTED
- SHIPPING_UPDATED
- INVENTORY_UPDATED