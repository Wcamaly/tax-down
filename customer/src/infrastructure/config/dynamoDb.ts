import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Environment } from "./enviroments";
import { DynamoDBDocument, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDbTable } from "../../domain/objects/DynamoDbTable";

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
  
  public async ensureTableExists(tables: DynamoDbTable[]): Promise<void> {
    
    for (const table of tables) {
      try {
        await this.client.describeTable({ TableName: table.tableName });
        console.log(`✅ La tabla "${table.tableName}" ya existe.`);
      } catch (error: any) {
        if (error.name === "ResourceNotFoundException") {
          console.log(`⚠️ La tabla "${table.tableName}" no existe. Creándola...`);
          this.client.createTable({
            TableName: table.tableName,
            KeySchema: table.keySchema,
            AttributeDefinitions: table.attributeDefinitions,
            BillingMode: table.billingMode,
          });
          console.log(`✅ Tabla "${table.tableName}" creada correctamente.`);
        } else {
          console.error("❌ Error verificando la tabla:", error);
          throw error;
        }
      }
    }
  }


}
