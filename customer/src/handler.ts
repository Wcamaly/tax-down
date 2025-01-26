import awsLambdaFastify from "@fastify/aws-lambda";
import { Route } from "./domain/objects/Route";
import { Server } from "./infrastructure/config/server";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from "aws-lambda";
import { DynamoDb } from "./infrastructure/config/dynamoDb";
import { Instances } from "./infrastructure/config/instances";


const routes = [
  new Route("/", "GET", (req, replay) => {
    replay.send({ message: "Hello World" });
  }),
];

const serverInstance = new Server();

const dynamoDbInstance = new DynamoDb();

const instances = new Instances(serverInstance, dynamoDbInstance);

instances.initializeDynamoDb();
instances.initializeRepositories();
instances.initializeUseCases();
instances.initializeDelivers();

serverInstance.registerRoutes(routes);

const proxy = awsLambdaFastify(serverInstance.getServer());

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  return proxy(event, context);
};