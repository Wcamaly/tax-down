#!/bin/sh

echo "🚀 Iniciando configuración de AWS en LocalStack..."

# Esperar a que LocalStack se inicie
until curl -s http://localstack:4566/_localstack/health | grep '"dynamodb": "available"'; do
  echo "Esperando a que LocalStack inicie DynamoDB..."
  sleep 2
done

echo "✅ LocalStack está listo!"

# Crear Cognito User Pool
echo "🔹 Creando Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool --pool-name MyUserPool --query 'UserPool.Id' --output text --endpoint-url=http://localstack:4566)
echo "User Pool creado: $USER_POOL_ID"

# Crear App Client
echo "🔹 Creando Cognito App Client..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client --user-pool-id $USER_POOL_ID --client-name MyAppClient --query 'UserPoolClient.ClientId' --output text --endpoint-url=http://localstack:4566)
echo "App Client creado: $CLIENT_ID"

# Crear DynamoDB Table
echo "🔹 Creando tabla DynamoDB..."
aws dynamodb create-table \
    --table-name CustomersTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url=http://dynamodb:8000

echo "✅ Configuración finalizada!"

# Iniciar Serverless Offline dentro del servicio `customer`
echo "🚀 Iniciando Serverless Offline..."
cd /app
serverless offline start