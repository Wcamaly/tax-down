import "reflect-metadata";
import awsLambdaFastify from "@fastify/aws-lambda";
import { Server } from "./infrastructure/config/server";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDb } from "./infrastructure/config/dynamoDb";
import { Instances, InstanceStatus } from "./infrastructure/config/instances";


const serverInstance = new Server();

const dynamoDbInstance = new DynamoDb();

const instances = new Instances(serverInstance, dynamoDbInstance);

let proxy: ((arg0: APIGatewayProxyEvent, arg1: Context) => Promise<APIGatewayProxyResult>) | null = null;

const initialized = async () => {
  try {
    if (instances.getStatus() === InstanceStatus.ERROR) {
      throw new Error("Instances are in error state");
    }
    if (instances.getStatus() === InstanceStatus.INITIALIZING) {
      console.log('⏳ Inicializando instancias...');
      await serverInstance.registerMiddlewares();
      await instances.initializeDynamoDb();
      await instances.initializeRepositories();
      await instances.initializeUseCases();
      await instances.initializeDelivers();
      console.log('✅ Proxy inicializado correctamente');
    }

    console.log("⏳ Creando proxy con awsLambdaFastify...");
    proxy = awsLambdaFastify(serverInstance.getServer());
    console.log("✅ Proxy inicializado correctamente");

  } catch (error) {
    console.error("🔥 Error en initialized():", error);
    throw new Error("Fallo en la inicialización de la aplicación");
  }
};


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    console.log('🛠️ Proxy antes de inicializar:', proxy ? "Inicializado" : "NO inicializado");

    if (!proxy) {
      await initialized();
    }

    if (proxy) {
      return await proxy(event, context);
    } else {
      console.error("❌ Error: Proxy no se inicializó correctamente");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Proxy is not initialized" }),
      };
    }
  } catch (error) {
    console.error("🔥 Error en handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: (error as Error).message }),
    };
  }
};
