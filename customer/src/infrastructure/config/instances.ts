import { IShipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";
import { CustomerRepository } from "../repositories/Customer.dynamo";
import { SalaryBalanceRepository } from "../repositories/SalaryBalance.dynamo";
import { SalaryRecordRepository } from "../repositories/SalaryRecord.dynamo";
import { ShippingRepository } from "../repositories/Shipping.dynamo";
import { DynamoDb } from "./dynamoDb";
import { Server } from "./server";

export class Instances {
  private shippingRepository?: IShippingRepository;
  private customerRepository?: CustomerRepository;
  private salaryBalanceRepository?: SalaryBalanceRepository;
  private salaryRecordRepository?: SalaryRecordRepository;
  constructor(private readonly server: Server, private readonly dynamoDb: DynamoDb) {}


  public initializeRepositories() {
    this.shippingRepository = new ShippingRepository(this.dynamoDb.getInstance());
    this.customerRepository = new CustomerRepository(this.dynamoDb.getInstance());
    this.salaryBalanceRepository = new SalaryBalanceRepository(this.dynamoDb.getInstance());
    this.salaryRecordRepository = new SalaryRecordRepository(this.dynamoDb.getInstance());
  }

  public initializeUseCases() {
    // TODO: Implement
  }

  public initializeDelivers() {
    // TODO: Implement
    this.server.registerRoutes([]);
  }

  public async initializeDynamoDb() {
    await this.dynamoDb.ensureTableExists([
      CustomerRepository.getCustomerDefinition(), 
      SalaryBalanceRepository.getCustomerDefinition(), 
      SalaryRecordRepository.getCustomerDefinition(), 
      ShippingRepository.getCustomerDefinition()]);
  }


}