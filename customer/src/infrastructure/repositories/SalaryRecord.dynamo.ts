import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";
import { SalaryRecord } from "../../domain/entities/SalaryRecord";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";

export class SalaryRecordRepository implements ISalaryRecordRepository {
  static TABE_NAME = "salary_record";
  static INDEX = {
    CUSTOMER_INDEX: "CustomerIndex",
    TYPE_INDEX: "TypeIndex"
  }

  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  async getSalaryRecord(customerId: string): Promise<SalaryRecord[]> {
    const command = new QueryCommand({
      TableName: SalaryRecordRepository.TABE_NAME,
      IndexName: SalaryRecordRepository.INDEX.CUSTOMER_INDEX,
      KeyConditionExpression: "customerId = :customerId",
      ExpressionAttributeValues: {
        ":customerId": { S: customerId }
      },
    })
    const res = await this.dynamoDb.send(command)
    if (res.Items && res.Items.length > 0) {
      return res.Items.map(item => {
        return SalaryRecord.fromJSON({
          id: item.id.S,
          customerId: item.customerId.S,
          amount: item.amount.N ? parseFloat(item.amount.N) : 0,
          currency: item.currency.S,
          type: item.type.S,
          description: item.description.S,
          createdAt: item.createdAt.S ? new Date(item.createdAt.S) : undefined
        })
      })
    }
    return [];
  }
  async createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord> {
    const command = new PutCommand({
      TableName: SalaryRecordRepository.TABE_NAME,
      Item: {
        id: { S: salaryRecord.id },
        customerId: { S: salaryRecord.customerId },
        amount: { N: salaryRecord.amount },
        currency: { S: salaryRecord.currency },
        type: { S: salaryRecord.type },
        description: { S: salaryRecord.description },
        createdAt: { S: salaryRecord.createdAt?.toISOString() }
      }
    })

    await this.dynamoDb.send(command)
    return salaryRecord;
  }

  static getCustomerDefinition() : CreateTableCommandInput {
    return {
      TableName : SalaryRecordRepository.TABE_NAME,
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "customerId", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "S" },
        { AttributeName: "type", AttributeType: "S" }
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: SalaryRecordRepository.INDEX.CUSTOMER_INDEX,
          KeySchema: [
            { AttributeName: "customerId", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" }
          ],
          Projection: { ProjectionType: "ALL" }
        },
        {
          IndexName: SalaryRecordRepository.INDEX.TYPE_INDEX,
          KeySchema: [
            { AttributeName: "type", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" }
          ],
          Projection: { ProjectionType: "ALL" }
        }
      ],
      BillingMode: "PAY_PER_REQUEST",
      } as CreateTableCommandInput;
  }
  
}