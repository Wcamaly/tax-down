import { CreateTableCommandInput, DynamoDB } from "@aws-sdk/client-dynamodb";
import { Environment } from "./enviroments";
import { DynamoDBDocument, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoDb {
  private readonly client: DynamoDB;
  private readonly instance: DynamoDBDocumentClient;
  constructor() {
     this.client = new DynamoDB({ region: Environment.AWS_REGION });
      this.instance = DynamoDBDocument.from(this.client);
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
          this.client.createTable(table);
          console.log(`✅ Tabla "${table.TableName}" creada correctamente.`);
        } else {
          console.error("❌ Error verificando la tabla:", error);
          throw error;
        }
      }
    }
  }


}
