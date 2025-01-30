import { CreateTableCommandInput, DynamoDB } from "@aws-sdk/client-dynamodb";
import { Environment } from "./enviroments";
import { DynamoDBDocument, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoDb {
  private readonly client: DynamoDB;
  private readonly instance: DynamoDBDocumentClient;
  constructor() {

    this.client = new DynamoDB({ 
      region: Environment.AWS_REGION,
      endpoint: Environment.DYNAMODB_ENDPOINT,
      credentials: {
        accessKeyId: Environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: Environment.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.instance = DynamoDBDocument.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true
      }
    });
   
  }

  public getInstance(): DynamoDBDocumentClient {

    return this.instance;
  }
  
  public async ensureTableExists(tables: CreateTableCommandInput[]): Promise<void> {
    
    for (const table of tables) {
      try {
        await this.client.describeTable({ TableName: table.TableName });
        console.log(`✅ La tabla "${table.TableName}" ya existe.`);
      } catch (error: any) {
        if (error.name === "ResourceNotFoundException") {
          console.log(`⚠️ La tabla "${table.TableName}" no existe. Creándola...`);
          await this.client.createTable(table);
          console.log(`✅ Tabla "${table.TableName}" creada correctamente.`);
        } else {
          console.error(`❌ Error verificando la tabla: ${table.TableName}`, error);
          throw error;
        }
      }
    }

  }


}
