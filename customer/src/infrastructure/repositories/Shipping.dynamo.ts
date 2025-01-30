import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Shipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class ShippingRepository implements IShippingRepository {
  static TABE_NAME = "shipping";
  
  static INDEX = {
    SHIPPING_DEFAULT_INDEX: "ShippingDefaultIndex"
  }
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {
  }
  
  async getShippings(customerId: string): Promise<Shipping[]> {
    const command = new QueryCommand({
      TableName: ShippingRepository.TABE_NAME,
      IndexName: ShippingRepository.INDEX.SHIPPING_DEFAULT_INDEX,
      KeyConditionExpression: "customerId = :customerId",
      ExpressionAttributeValues: {
        ":customerId": { S: customerId }
      },
      ConsistentRead: false
    })
    const res = await this.dynamoDb.send(command)
    return res.Items?.map(item => Shipping.fromJSON(unmarshall(item))) || []
  }
  async createShipping(shipping: Shipping): Promise<Shipping> {
      const command = new PutCommand({
        TableName: ShippingRepository.TABE_NAME,
        Item: shipping.toJSON()
      })
      await this.dynamoDb.send(command)
      return shipping;
  }
  async updateShipping(shipping: Shipping): Promise<Shipping> {
    await this.deleteShipping(shipping.id)
    return await this.createShipping(shipping)
  }
  async deleteShipping(shippingId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: ShippingRepository.TABE_NAME,
      Key: {
        id: shippingId 
      }
    })
    await this.dynamoDb.send(command)
  }
  async getShippingDefault(customerId: string): Promise<Shipping | null> {
    const command = new QueryCommand({
      TableName: ShippingRepository.TABE_NAME,
      IndexName: ShippingRepository.INDEX.SHIPPING_DEFAULT_INDEX,
      KeyConditionExpression: "customerId = :customerId and isDefault = :isDefault",
      ExpressionAttributeValues: {
        ":customerId": { S: customerId },
        ":isDefault": { N: "1" }
      },
      Limit: 1,
      ConsistentRead: false
    })
    const res = await this.dynamoDb.send(command)
    if (res.Items && res.Items.length > 0) {
      return Shipping.fromJSON(unmarshall(res.Items[0]))
    }
    return null;

  }
   static getCustomerDefinition() : CreateTableCommandInput {
      return {
        TableName : ShippingRepository.TABE_NAME,
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "customerId", AttributeType: "S" },
          { AttributeName: "createdAt", AttributeType: "S" },
          { AttributeName: "isDefault", AttributeType: "N" }
        ],
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: ShippingRepository.INDEX.SHIPPING_DEFAULT_INDEX,
            KeySchema: [
              { AttributeName: "customerId", KeyType: "HASH" },
              { AttributeName: "isDefault", KeyType: "RANGE" }
            ],
            Projection: { ProjectionType: "ALL" }
          }
        ],

        BillingMode: "PAY_PER_REQUEST",
        } as CreateTableCommandInput;
    }


}