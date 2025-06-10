# Generate Invoice Function

## Description
Generates an invoice for an order or transaction.

## Inputs
- order_id: string (required) - Order identifier
- customer_id: integer (required) - Customer identifier
- items: array (required) - Line items for invoice
- billing_address: object (required) - Billing address
- payment_terms: object (optional) - Payment terms and conditions

## Outputs
- invoice_id: string - Unique invoice identifier
- invoice_number: string - Human-readable invoice number
- invoice_url: string - URL to download invoice
- due_date: date - Payment due date
- total_amount: decimal - Total invoice amount

## Events Generated
- INVOICE_GENERATED
- INVOICE_SENT
- PAYMENT_TERMS_APPLIED