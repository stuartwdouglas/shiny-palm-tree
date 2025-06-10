# Search Products Function

## Description
Searches and filters products based on various criteria.

## Inputs
- query: string (optional) - Search term
- category_id: integer (optional) - Filter by category
- price_range: object (optional) {
    min: decimal,
    max: decimal
  }
- in_stock_only: boolean (optional) - Filter to only in-stock items
- sort_by: string (optional) - Sorting field
- sort_order: string (optional) - 'asc' or 'desc'
- page: integer (optional) - Page number for pagination
- per_page: integer (optional) - Items per page

## Outputs
- products: array of product objects
- total_count: integer - Total number of matching products
- page_count: integer - Total number of pages
- current_page: integer - Current page number

## Events Generated
- PRODUCT_SEARCH_PERFORMED