# Update Shipping Status Function

## Description
Updates the status of shipments and notifies relevant parties.

## Inputs
- shipment_id: string (required) - Shipment identifier
- new_status: string (required) - Updated shipping status
- location: object (optional) - Current location
- notes: string (optional) - Status update notes
- timestamp: datetime (required) - Update timestamp

## Outputs
- status: string - Update status
- notification_status: object - Notification delivery status
- updated_tracking: object - Updated tracking information
- error_message: string - Error details if failed

## Events Generated
- SHIPPING_STATUS_UPDATED
- CUSTOMER_NOTIFIED
- SYSTEM_UPDATED
- TRACKING_UPDATED