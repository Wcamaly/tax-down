import { AddContactUsecase } from "../../application/customer/AddContact";
import { AddPhoneUsecase } from "../../application/customer/AddPhone";
import { AddRecordUsecase } from "../../application/customer/AddRecord";
import { AddShippingUsecase } from "../../application/customer/AddShipping";
import { AvailableCreditUsecase } from "../../application/customer/AvailableCredit";
import { CreateCustomerUsecase } from "../../application/customer/CreateCustomer";
import { GetCustomerUsecase } from "../../application/customer/GetCustomer";
import { IShipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";
import { CustomerPostDelivers } from "../delivers/customer/customer.post";
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

  private addContact?: AddContactUsecase;
  private addPhone?: AddPhoneUsecase;
  private createCustomer?: CreateCustomerUsecase;
  private getCustomer?: GetCustomerUsecase;
  private getAvailableCredit?: AvailableCreditUsecase;
  private addShipping?: AddShippingUsecase;
  private addRecord?: AddRecordUsecase


  constructor(private readonly server: Server, private readonly dynamoDb: DynamoDb) {}


  public initializeRepositories() {
    this.shippingRepository = new ShippingRepository(this.dynamoDb.getInstance());
    this.customerRepository = new CustomerRepository(this.dynamoDb.getInstance());
    this.salaryBalanceRepository = new SalaryBalanceRepository(this.dynamoDb.getInstance());
    this.salaryRecordRepository = new SalaryRecordRepository(this.dynamoDb.getInstance());
  }

  public initializeUseCases() {
    if (!this.customerRepository || !this.salaryBalanceRepository || !this.salaryRecordRepository || !this.shippingRepository) {
      throw new Error("Repositories must be initialized before use cases");
    }
     this.addContact = new AddContactUsecase(this.customerRepository);
     this.addPhone = new AddPhoneUsecase(this.customerRepository);
     this.createCustomer = new CreateCustomerUsecase(this.customerRepository, this.salaryBalanceRepository);
     this.getCustomer = new GetCustomerUsecase(this.customerRepository);
     this.getAvailableCredit = new AvailableCreditUsecase(this.customerRepository, this.salaryBalanceRepository);
     this.addShipping = new AddShippingUsecase(this.customerRepository, this.shippingRepository);
     this.addRecord = new AddRecordUsecase(this.salaryRecordRepository, this.salaryBalanceRepository);
  }

  public initializeDelivers() {
    if (!this.createCustomer || !this.addShipping || !this.addRecord) {
      throw new Error("Use cases must be initialized before delivers");
    }
    new CustomerPostDelivers(this.createCustomer, this.addShipping, this.addRecord).registerRoutes(this.server.getServer());
  }

  public async initializeDynamoDb() {
    await this.dynamoDb.ensureTableExists([
      CustomerRepository.getCustomerDefinition(), 
      SalaryBalanceRepository.getCustomerDefinition(), 
      SalaryRecordRepository.getCustomerDefinition(), 
      ShippingRepository.getCustomerDefinition()]);
  }


}