#!/bin/bash

# Configuration
PROJECT_ID="${1:-}"
REGION="us-central1"
SERVICE_NAME="clans-api"
DB_NAME="clans_db"
DB_USER="postgres"
CLOUD_SQL_CONNECTION_NAME="$PROJECT_ID:$REGION:clans-db"

echo "Starting deployment of Clans API..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required Google Cloud APIs..."
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Build and push the container
echo "🔨 Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run with Secret Manager
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME \
  --set-env-vars DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME,DB_NAME=$DB_NAME,DB_USER=$DB_USER,NODE_ENV=production \
  --set-secrets DB_PASSWORD=db-password:latest \
  --memory 512Mi \
  --max-instances 10

# Grant Cloud SQL Client permission to Cloud Run service account
SERVICE_ACCOUNT=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(spec.template.spec.serviceAccountName)')
echo "🔑 Granting Cloud SQL permissions to service account: $SERVICE_ACCOUNT"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/cloudsql.client"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Deployment complete!"
echo "Your API is available at: $SERVICE_URL"