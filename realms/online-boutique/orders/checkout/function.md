# Checkout Function

## Description
Converts a shopping cart into an order and initiates the payment process.

## Inputs
- cart_id: string (required) - Cart identifier
- customer_id: integer (required) - Customer identifier
- shipping_address_id: integer (required) - Shipping address identifier
- billing_address_id: integer (required) - Billing address identifier
- payment_method_id: integer (required) - Payment method identifier
- shipping_method_id: integer (required) - Shipping method identifier
- coupon_code: string (optional) - Discount coupon code

## Outputs
- order_id: string - New order identifier
- status: string - Success/failure status
- message: string - Success/error message
- order_summary: object {
    subtotal: decimal,
    shipping: decimal,
    tax: decimal,
    total: decimal
  }

## Events Generated
- ORDER_CREATED
- PAYMENT_INITIATED
- INVENTORY_RESERVED
- CART_CLEARED