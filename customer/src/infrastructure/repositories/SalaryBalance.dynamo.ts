import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SalaryBalance } from "../../domain/entities/SalaryBalance";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";

export class SalaryBalanceRepository implements ISalaryBalanceRepository {
  static TABE_NAME = "salary_balance";
  static INDEX = {
    CUSTOMER_INDEX: "CustomerIndex"
  }

  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}
  async createSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance> {
    const command = new PutCommand({
      TableName: SalaryBalanceRepository.TABE_NAME,
      Item: {
        id: { S: salaryBalance.id },
        customerId: { S: salaryBalance.customerId },
        balance: { N: salaryBalance.balance.toString() },
        currency: { S: salaryBalance.currency },
        lastUpdated: { S: salaryBalance.lastUpdated.toISOString() },
        lastRecordId: { S: salaryBalance.lastRecordId },
        createdAt: { S: salaryBalance.createdAt?.toISOString() }
      }
    })
    await this.dynamoDb.send(command)
    return salaryBalance;

  }
  async deleteSalaryBalance(customerId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: SalaryBalanceRepository.TABE_NAME,
      Key: {
        id: { S: customerId }
      }
    })
    await this.dynamoDb.send(command)
  }
  async getSalaryBalance(customerId: string): Promise<SalaryBalance> {
    const command = new QueryCommand(
      {
        TableName: SalaryBalanceRepository.TABE_NAME,
        IndexName: SalaryBalanceRepository.INDEX.CUSTOMER_INDEX,
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
          ":customerId": { S: customerId }
        },
        ConsistentRead: true
      })
      const res = await this.dynamoDb.send(command)
      if (!res.Items || res.Items.length === 0) {
        throw new Error("Salary balance not found");
      }
      return SalaryBalance.fromJSON({
        id: res.Items[0].id.S,
        customerId: res.Items[0].customerId.S,
        balance: res.Items[0].balance.N,
        currency: res.Items[0].currency.S,
        lastUpdated: res.Items[0].lastUpdated.S,
        lastRecordId: res.Items[0].lastRecordId.S,
        createdAt: res.Items[0].createdAt.S
      });
  }
  async updateSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance> {
    // TODO validate complete execution
    await this.deleteSalaryBalance(salaryBalance.id);
    await this.createSalaryBalance(salaryBalance);
    return salaryBalance;
  }

  

   static getCustomerDefinition() : CreateTableCommandInput {
      return {
        TableName : SalaryBalanceRepository.TABE_NAME,
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "customerId", AttributeType: "S" },
          { AttributeName: "recordId", AttributeType: "S" },
          { AttributeName: "createdAt", AttributeType: "S" }
        ],
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }
        ],

        GlobalSecondaryIndexes: [
          {
            IndexName: "CustomerIndex",
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