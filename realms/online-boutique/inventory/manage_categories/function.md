# Manage Categories Function

## Description
Creates, updates, and manages product categories.

## Inputs
### For Create:
- name: string (required) - Category name
- description: string (optional) - Category description
- parent_category_id: integer (optional) - ID of parent category

### For Update:
- category_id: integer (required) - ID of category to update
- name: string (optional) - New category name
- description: string (optional) - New category description
- parent_category_id: integer (optional) - New parent category ID

### For Delete:
- category_id: integer (required) - ID of category to delete
- transfer_products_to: integer (optional) - Category ID to transfer products to

## Outputs
- status: string - Success/failure status
- message: string - Success/error message
- category_id: integer - ID of affected category

## Events Generated
- CATEGORY_CREATED
- CATEGORY_UPDATED
- CATEGORY_DELETED
- PRODUCTS_RECATEGORIZED