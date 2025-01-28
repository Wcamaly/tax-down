FROM node:latest

WORKDIR /app

# Instalar AWS CLI    
RUN apt-get update && apt-get install -y unzip curl \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip && ./aws/install \
    && rm -rf awscliv2.zip aws/
    
RUN command -v pnpm || npm install -g pnpm
# Instalar Serverless Framework globalmente
RUN npm install -g serverless
RUN npm install -g serverless-dynamodb-local@0.2.10 serverless-offline serverless-dotenv-plugin serverless-offline-sns


COPY package.json ./
RUN pnpm install

COPY . .

CMD ["/bin/sh", "/app/start.sh"]
