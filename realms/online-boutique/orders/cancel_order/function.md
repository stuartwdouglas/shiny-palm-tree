# Cancel Order Function

## Description
Cancels an order and handles related processes like refunds and inventory updates.

## Inputs
- order_id: string (required) - Order identifier
- reason: string (required) - Cancellation reason
- cancellation_type: string (required) - 'full' or 'partial'
- items: array (required for partial) - Items to cancel
- refund_method: string (required) - How to process refund

## Outputs
- status: string - Success/failure status
- message: string - Success/error message
- refund_status: string - Status of refund
- inventory_status: string - Status of inventory update

## Events Generated
- ORDER_CANCELLED
- REFUND_INITIATED
- INVENTORY_RESTORED
- SHIPPING_CANCELLED