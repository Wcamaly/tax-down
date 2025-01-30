import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SalaryBalance } from "../../domain/entities/SalaryBalance";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";

import { CreateTableCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class SalaryBalanceRepository implements ISalaryBalanceRepository {
  static TABE_NAME = "salary_balance";
  static INDEX = {
    SALARY_BALANCE_INDEX: "SalaryBalanceIndex"
  }

  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}
  async createSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance> {
    const command = new PutCommand({
      TableName: SalaryBalanceRepository.TABE_NAME,
      Item:  salaryBalance.toJSON()
    })
  
    await this.dynamoDb.send(command)
    return salaryBalance;

  }
  async deleteSalaryBalance(salaryBalanceId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: SalaryBalanceRepository.TABE_NAME,
      Key: {
        id: salaryBalanceId 
      }
    })
    await this.dynamoDb.send(command)
  }
  async getSalaryBalance(customerId: string): Promise<SalaryBalance> {
    const command = new QueryCommand(
      {
        TableName: SalaryBalanceRepository.TABE_NAME,
        IndexName: SalaryBalanceRepository.INDEX.SALARY_BALANCE_INDEX,
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
          ":customerId": { S: customerId }
        },
        ConsistentRead: false
      })
      const res = await this.dynamoDb.send(command)
      if (!res.Items || res.Items.length === 0) {
        throw new Error("Salary balance not found");
      }
      return SalaryBalance.fromJSON(unmarshall(res.Items[0]))
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
          { AttributeName: "createdAt", AttributeType: "S" }
        ],
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }
        ],

        GlobalSecondaryIndexes: [
          {
            IndexName: SalaryBalanceRepository.INDEX.SALARY_BALANCE_INDEX,
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