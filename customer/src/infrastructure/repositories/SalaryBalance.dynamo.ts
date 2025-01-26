import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SalaryBalance } from "../../domain/entities/SalaryBalance";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";

export class SalaryBalanceRepository implements ISalaryBalanceRepository {
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}
  getSalaryBalance(customerId: string): Promise<SalaryBalance> {
    throw new Error("Method not implemented.");
  }
  updateSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance> {
    throw new Error("Method not implemented.");
  }
}