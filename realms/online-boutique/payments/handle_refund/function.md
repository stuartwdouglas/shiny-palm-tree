# Handle Refund Function

## Description
Processes refunds for orders or transactions.

## Inputs
- transaction_id: string (required) - Original transaction identifier
- refund_amount: decimal (required) - Amount to refund
- reason: string (required) - Reason for refund
- refund_type: string (required) - 'full' or 'partial'
- customer_id: integer (required) - Customer identifier

## Outputs
- refund_id: string - Unique refund identifier
- status: string - Refund status
- processed_amount: decimal - Amount actually refunded
- error_message: string - Error details if failed

## Events Generated
- REFUND_INITIATED
- REFUND_PROCESSED
- REFUND_FAILED
- REFUND_SUCCEEDED