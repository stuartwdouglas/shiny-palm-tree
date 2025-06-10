# Delete Product Function

## Description
Marks a product as deleted or archives it from the system. Does not permanently remove the product to maintain order history integrity.

## Inputs
- product_id: integer (required) - ID of the product to delete
- delete_type: string (required) - Type of deletion ('archive' or 'soft_delete')
- reason: string (optional) - Reason for deletion

## Outputs
- status: string - Success/failure status
- message: string - Success/error message

## Events Generated
- PRODUCT_DELETED
- INVENTORY_ADJUSTED
- PRODUCT_ARCHIVED (if archived)