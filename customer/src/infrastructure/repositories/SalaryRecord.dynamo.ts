import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";
import { SalaryRecord } from "../../domain/entities/SalaryRecord";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class SalaryRecordRepository implements ISalaryRecordRepository {
  static TABE_NAME = "salary_record";
  static INDEX = {
    SALARY_RECORD_BY_CUSTOMER: "SalaryRecordByCustomerIndex",
    TYPE_INDEX: "TypeIndex"
  }

  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  async getSalaryRecord(customerId: string): Promise<SalaryRecord[]> {
    const command = new QueryCommand({
      TableName: SalaryRecordRepository.TABE_NAME,
      IndexName: SalaryRecordRepository.INDEX.SALARY_RECORD_BY_CUSTOMER,
      KeyConditionExpression: "customerId = :customerId",
      ExpressionAttributeValues: {
        ":customerId": { S: customerId }
      },
      ConsistentRead: false
    })
    const res = await this.dynamoDb.send(command)
    if (res.Items && res.Items.length > 0) {
      return res.Items.map(item => {
        return SalaryRecord.fromJSON(unmarshall(item))
      })
    }
    return [];
  }
  async createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord> {
    const command = new PutCommand({
      TableName: SalaryRecordRepository.TABE_NAME,
      Item: salaryRecord.toJSON()
    })
    await this.dynamoDb.send(command)
    return salaryRecord;
  }

  async deleteSalaryRecord(customerId: string): Promise<void> {
     const salaryRecords = await this.getSalaryRecord(customerId); // TODO : I need to paginate this
     for (const salaryRecord of salaryRecords) {
      const command = new DeleteCommand({
        TableName: SalaryRecordRepository.TABE_NAME,
        Key: { id: salaryRecord.id }
      });
      await this.dynamoDb.send(command);
     }
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
          IndexName: SalaryRecordRepository.INDEX.SALARY_RECORD_BY_CUSTOMER,
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