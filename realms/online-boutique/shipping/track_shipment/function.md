# Track Shipment Function

## Description
Provides real-time tracking information for shipments.

## Inputs
- tracking_number: string (required) - Shipment tracking number
- carrier: string (required) - Shipping carrier
- shipment_id: string (optional) - Internal shipment identifier
- customer_id: string (optional) - Customer identifier

## Outputs
- tracking_status: string - Current shipment status
- location: object - Current shipment location
- delivery_estimate: date - Updated delivery estimate
- tracking_history: array - Status history
- error_message: string - Error details if failed

## Events Generated
- TRACKING_REQUESTED
- STATUS_UPDATED
- DELIVERY_UPDATED
- CUSTOMER_NOTIFIED