import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";
import { SalaryRecord } from "../../domain/entities/SalaryRecord";

export class SalaryRecordRepository implements ISalaryRecordRepository {
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  getSalaryRecord(customerId: string): Promise<SalaryRecord[]> {
    throw new Error("Method not implemented.");
  }
  createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord> {
    throw new Error("Method not implemented.");
  }
  
}