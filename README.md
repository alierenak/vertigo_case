# Clans API

A lightweight REST API for managing clans, designed to run on Google Cloud Run with Cloud SQL.

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

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clans_db
DB_USER=postgres
DB_PASSWORD=your_password
```

3. Run the database schema:
```bash
psql -U postgres -d clans_db -f schema.sql
```

4. Start the development server:
```bash
npm run dev
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t clans-api .
```

2. Run the container:
```bash
docker run -p 8080:8080 --env-file .env clans-api
```

## Google Cloud Run Deployment

1. Build and push to Google Container Registry:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/clans-api
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy clans-api \
  --image gcr.io/PROJECT_ID/clans-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances CONNECTION_NAME \
  --set-env-vars DB_HOST=/cloudsql/CONNECTION_NAME,DB_NAME=clans_db,DB_USER=postgres,DB_PASSWORD=your_password
```

## Environment Variables

- `PORT`: Server port (default: 8080)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

## Sample Data

The project supports importing sample clan data. The data should be in UTC timezone format.