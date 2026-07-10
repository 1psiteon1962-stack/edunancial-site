# API Documentation

## `GET /api/health`
- **Purpose**: Basic liveness check.
- **Response**: `200` JSON: `{ "ok": true }`

## `POST /api/contracts/accept`
- **Purpose**: Accept contract event echo endpoint.
- **Request body**:
  ```json
  { "contractId": "string" }
  ```
- **Response**: `200` JSON:
  ```json
  { "status": "accepted", "contractId": "..." }
  ```

## `POST /api/kpi`
- **Purpose**: KPI ingest endpoint.
- **Required field**: `event_name`
- **Request body**:
  ```json
  {
    "event_name": "string",
    "event_type": "optional-string",
    "metadata": { "any": "json" }
  }
  ```
- **Response**:
  - `200`: `{ "success": true }`
  - `400`: missing `event_name`
  - `500`: route failure

## `POST /api/kpi/track`
- **Purpose**: KPI tracking endpoint (logs payload).
- **Request body**: arbitrary JSON payload.
- **Response**:
  - `200`: `{ "success": true }`
  - `500`: tracking failure

## `POST /api/square/checkout`
- **Purpose**: Returns application checkout redirect URL.
- **Request body**:
  ```json
  { "id": "product-or-plan-id" }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "checkoutUrl": "/checkout?product=<id>"
  }
  ```

## `GET /admin/kpi/export`
- **Purpose**: Download KPI events CSV.
- **Response**:
  - `200` with `text/csv` attachment
  - `500` JSON on failure
- **Current implementation note**: exports mock/fallback data from `src/lib/kpi/adminQueries.ts`.
