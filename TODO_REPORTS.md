# TODO - Reports Management Update

## Task
Update ReportsManagement component for superadmin with:
- Multiple report types (Orders, Users, Products, Stock)
- Start date and end date filters
- Print/Download options
- Good UI

## Steps

- [x] 1. Create reports API service (src/services/reportsService.ts)
- [x] 2. Update ReportsManagement component with:
  - [x] 2.1 Add report type selection tabs
  - [x] 2.2 Add date pickers for start/end date
  - [x] 2.3 Add specific filters for each report type
  - [x] 2.4 Add download/print functionality
  - [x] 2.5 Improve UI with loading states and error handling

## API Endpoints
- GET /api/reports/orders - Orders report PDF
- GET /api/reports/orders/status-summary - Orders status summary
- GET /api/reports/users - Users report PDF
- GET /api/reports/products - Products report PDF
- GET /api/reports/stock - Stock report PDF

