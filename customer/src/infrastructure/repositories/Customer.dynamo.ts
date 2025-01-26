import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Customer } from "../../domain/entities/Customer";
import { DynamoDbTable } from "../../domain/objects/DynamoDbTable";

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}
  getCustomer(cognitoId: string): Promise<Customer> {
    throw new Error("Method not implemented.");
  }
  createCustomer(customer: Customer): Promise<Customer> {
    throw new Error("Method not implemented.");
  }
  updateCustomer(customer: Customer): Promise<Customer> {
    throw new Error("Method not implemented.");
  }
  deleteCustomer(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  static getCustomerDefinition() : DynamoDbTable {
    return new DynamoDbTable(
      "customer",
      [],
      [],
      "PAY_PER_REQUEST"
    );
  }
}
