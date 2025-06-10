# Create Shipment Function

## Description
Creates a new shipment for an order.

## Inputs
- order_id: string (required) - Order identifier
- shipping_method: string (required) - Selected shipping method
- shipping_address: object (required) - Delivery address
- items: array (required) - Items to ship
- special_instructions: string (optional) - Handling instructions

## Outputs
- shipment_id: string - Unique shipment identifier
- tracking_number: string - Shipping tracking number
- label_url: string - Shipping label URL
- estimated_delivery: date - Estimated delivery date
- error_message: string - Error details if failed

## Events Generated
- SHIPMENT_CREATED
- LABEL_GENERATED
- TRACKING_ASSIGNED
- INVENTORY_UPDATED