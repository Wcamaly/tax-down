import { CreateTableCommandInput,  QueryCommand } from "@aws-sdk/client-dynamodb";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Customer } from "../../domain/entities/Customer";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export class CustomerRepository implements ICustomerRepository {

  static TABE_NAME = "customer";
  
  static INDEX = {
    COGNITO_INDEX: "CognitoIndex"
  }
  
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  async getCustomer(customerId: string): Promise<Customer | null> {
    const command = new GetCommand({
      TableName: CustomerRepository.TABE_NAME,
      Key: { id: customerId }
    });
    const res = await this.dynamoDb.send(command);
    return res.Item ? Customer.fromJSON(res.Item) : null;
  }
  
  async getCustomerByCognitoId(cognitoId: string): Promise<Customer | null> {
    const command = new QueryCommand(
      {
        TableName: CustomerRepository.TABE_NAME,
        IndexName: CustomerRepository.INDEX.COGNITO_INDEX,
        KeyConditionExpression: "cognitoId = :cognitoId",
        ExpressionAttributeValues: {
          ":cognitoId": { S: cognitoId }
        },
        Limit: 1,
        ConsistentRead: false
      }
    )
    const res = await this.dynamoDb.send(command)
    if (res.Items && res.Items.length > 0) {
      const item = unmarshall(res.Items[0]);
      return Customer.fromJSON(item);
    }
    return null;
  }
  async createCustomer(customer: Customer): Promise<Customer> {
    
    const command = new PutCommand({
      TableName: CustomerRepository.TABE_NAME,
      Item: customer.toJSON()
    });
    
    const res = await this.dynamoDb.send(command);
    if (res) {
      return customer;
    }
    throw new Error("Failed to create customer");
  }
  async updateCustomer(customer: Customer): Promise<Customer> {
    // TODO validate complete execution
    await this.deleteCustomer(customer.id);
    await this.createCustomer(customer);
    return customer;
  }
  async deleteCustomer(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: CustomerRepository.TABE_NAME,
      Key: { id }
    });
    await this.dynamoDb.send(command);
  }

  static getCustomerDefinition() : CreateTableCommandInput {
    return {
      TableName : CustomerRepository.TABE_NAME,
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "cognitoId", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },  // Clave primaria
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: CustomerRepository.INDEX.COGNITO_INDEX,
          KeySchema: [
            { AttributeName: "cognitoId", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" }
            
          ],
          Projection: { ProjectionType: "ALL" }
        }
      ],
      BillingMode: "PAY_PER_REQUEST"
    } as CreateTableCommandInput;
  }
}
