import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Shipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";

export class ShippingRepository implements IShippingRepository {
  static TABE_NAME = "shipping";
  
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {
  }
  
  getShippings(customerId: string): Promise<Shipping[]> {
    throw new Error("Method not implemented.");
  }
  async createShipping(shipping: Shipping): Promise<Shipping> {
      const command = new PutCommand({
        TableName: ShippingRepository.TABE_NAME,
        Item: {
          id: { S: shipping.id },
          addressLine: { S: shipping.addressLine },
          city: { S: shipping.city },
          state: { S: shipping.state },
          country: { S: shipping.country },
          postalCode: { S: shipping.postalCode },
          isDefault: { N: shipping.isDefault ? "1" : "0" },
        }
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
        id: { S: shippingId }
      }
    })
    await this.dynamoDb.send(command)
  }
  async getShippingDefault(customerId: string): Promise<Shipping | null> {
    const command = new QueryCommand({
      TableName: ShippingRepository.TABE_NAME,
      IndexName: "CustomerIndexByIsDefault",
      KeyConditionExpression: "customerId = :customerId and isDefault = :isDefault",
      ExpressionAttributeValues: {
        ":customerId": { S: customerId },
        ":isDefault": { N: "1" }
      },
      Limit: 1
    })
    const res = await this.dynamoDb.send(command)
    if (res.Items && res.Items.length > 0) {
      return Shipping.fromJSON({
        id: res.Items[0].id.S,
        addressLine: res.Items[0].addressLine.S,
        city: res.Items[0].city.S,
        state: res.Items[0].state.S,
        country: res.Items[0].country.S,
        postalCode: res.Items[0].postalCode.S,
        isDefault: res.Items[0].isDefault.N === "1"
      });
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
            IndexName: "CustomerIndexByIsDefault",
            KeySchema: [
              { AttributeName: "customerId", KeyType: "HASH" },
              { AttributeName: "isDefault", KeyType: "RANGE" }
            ],
            Projection: { ProjectionType: "ALL" }
          },
          {
            IndexName: "CustomerIndexByCreatedAt",
            KeySchema: [
              { AttributeName: "customerId", KeyType: "HASH" },
              { AttributeName: "createdAt", KeyType: "RANGE" }
            ],
            Projection: { ProjectionType: "ALL" }
          },
        ],

        BillingMode: "PAY_PER_REQUEST",
        } as CreateTableCommandInput;
    }


}