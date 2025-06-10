# Update Product Function

## Description
Updates an existing product's information, including its details, inventory levels, images, and attributes.

## Inputs
- product_id: integer (required) - ID of the product to update
- name: string (optional) - New product name
- description: string (optional) - New product description
- price: decimal (optional) - New product price
- category_id: integer (optional) - New category ID
- sku: string (optional) - New SKU
- images: array of {
    image_url: string,
    is_primary: boolean
  } (optional)
- attributes: array of {
    name: string,
    value: string
  } (optional)

## Outputs
- status: string - Success/failure status
- message: string - Success/error message
- updated_fields: array - List of fields that were updated

## Events Generated
- PRODUCT_UPDATED
- PRICE_CHANGED (if price updated)
- CATEGORY_CHANGED (if category updated)