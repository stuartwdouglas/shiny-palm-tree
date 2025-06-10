# Add Product Function

## Description
Creates a new product in the system with all its associated details including inventory levels, images, and attributes.

## Inputs
- name: string (required) - Product name
- description: string (required) - Product description
- price: decimal (required) - Product price
- category_id: integer (required) - ID of the product category
- sku: string (required) - Unique stock keeping unit
- initial_stock: integer (required) - Initial inventory quantity
- low_stock_threshold: integer (optional) - Threshold for low stock alerts
- images: array of {
    image_url: string,
    is_primary: boolean
  } (optional)
- attributes: array of {
    name: string,
    value: string
  } (optional)

## Outputs
- product_id: integer - ID of the newly created product
- status: string - Success/failure status
- message: string - Success/error message

## Events Generated
- PRODUCT_CREATED
- INVENTORY_INITIALIZED
- LOW_STOCK_ALERT_SET (if threshold provided)