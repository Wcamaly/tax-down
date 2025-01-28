import "reflect-metadata";
import awsLambdaFastify from "@fastify/aws-lambda";
import { Server } from "./infrastructure/config/server";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from "aws-lambda";
import { DynamoDb } from "./infrastructure/config/dynamoDb";
import { Instances } from "./infrastructure/config/instances";


const serverInstance = new Server();

const dynamoDbInstance = new DynamoDb();

const instances = new Instances(serverInstance, dynamoDbInstance);

instances.initializeDynamoDb().then(() => {
  
  instances.initializeRepositories();
  instances.initializeUseCases();
  instances.initializeDelivers();
});
const proxy = awsLambdaFastify(serverInstance.getServer());

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log("Event: ", event);
  return proxy(event, context);
};

if (process.env.IS_OFFLINE) {
  serverInstance.getServer().listen({ port: 3000 }, () => {
    console.log("🚀 Server running on http://localhost:3000 (Offline Mode)");
  });
}