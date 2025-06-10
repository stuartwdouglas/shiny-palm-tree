# Manage Addresses Function

## Description
Manages customer shipping and billing addresses.

## Inputs
- customer_id: string (required) - Customer identifier
- action: string (required) - 'add', 'update', or 'delete'
- address: object (required for add/update) {
    type: string,
    street_address1: string,
    street_address2: string,
    city: string,
    state: string,
    postal_code: string,
    country: string,
    is_default: boolean
  }
- address_id: string (required for update/delete) - Address identifier

## Outputs
- status: string - Operation status
- address_id: string - Affected address ID
- updated_address_list: array - List of customer addresses
- error_message: string - Error details if failed

## Events Generated
- ADDRESS_ADDED
- ADDRESS_UPDATED
- ADDRESS_DELETED
- DEFAULT_ADDRESS_CHANGED