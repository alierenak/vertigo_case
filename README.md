# Clans API - Cloud Run Deployment

A REST API for managing clans, designed specifically for Google Cloud Run with Cloud SQL.

## Features

- Create clans with name and optional region
- List all clans with filtering and sorting capabilities
- Get specific clan by ID
- Delete clans
- UUID-based identification
- Automatic timestamp generation in UTC

## API Endpoints

### 1. Create a Clan
```
POST /clans
Content-Type: application/json

{
  "name": "Shadow Warriors",
  "region": "TR"
}

Response:
{
  "id": "generated-uuid",
  "message": "Clan created successfully."
}
```

### 2. List All Clans
```
GET /clans?region=TR&sort=created_at

Query Parameters:
- region: Filter by region (optional)
- sort: Sort by created_at or -created_at for descending (optional)

Response: Array of clan objects
```

### 3. Get Clan by ID
```
GET /clans/{id}

Response: Single clan object
```

### 4. Delete a Clan
```
DELETE /clans/{id}

Response:
{
  "message": "Clan deleted successfully"
}
```

## Database Schema

```sql
CREATE TABLE clans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment to Google Cloud Run

### Prerequisites
1. Google Cloud project
2. gcloud CLI installed and authenticated
3. Cloud SQL PostgreSQL instance created

### Setup Cloud SQL Database
1. Connect to your Cloud SQL instance:
```bash
gcloud sql connect clans-db --user=postgres
```

2. Create database and schema:
```sql
CREATE DATABASE clans_db;
\c clans_db
-- Then run the contents of schema.sql
```

### Deploy to Cloud Run

Run the deployment script:
```bash
./deploy.sh PROJECT_ID
```