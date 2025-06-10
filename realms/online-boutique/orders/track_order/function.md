# Track Order Function

## Description
Provides order status and tracking information.

## Inputs
- order_id: string (required) - Order identifier
- customer_id: integer (optional) - Customer identifier for verification

## Outputs
- status: string - Success/failure status
- order_status: string - Current order status
- tracking_info: object {
    carrier: string,
    tracking_number: string,
    estimated_delivery: date,
    current_location: string,
    status_history: array
  }
- order_details: object {
    items: array,
    shipping_address: object,
    payment_status: string
  }

## Events Generated
- ORDER_TRACKED
- TRACKING_INFORMATION_ACCESSED