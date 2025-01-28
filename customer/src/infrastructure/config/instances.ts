import { AddContactUsecase } from "../../application/customer/AddContact";
import { AddPhoneUsecase } from "../../application/customer/AddPhone";
import { AddRecordUsecase } from "../../application/customer/AddRecord";
import { AddShippingUsecase } from "../../application/customer/AddShipping";
import { AvailableCreditUsecase } from "../../application/customer/AvailableCredit";
import { CreateCustomerUsecase } from "../../application/customer/CreateCustomer";
import { GetCustomerUsecase } from "../../application/customer/GetCustomer";
import { GetShippingUsecase } from "../../application/customer/GetShipping";
import { IShipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";
import { CustomerGetDeliver } from "../delivers/customer/customer.get";
import { CustomerPostDelivers } from "../delivers/customer/customer.post";
import { HealthGetDeliver } from "../delivers/health/health.get";
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
  private getShipping?: GetShippingUsecase;
  


  constructor(private readonly server: Server, private readonly dynamoDb: DynamoDb) {}


  public initializeRepositories() {
    console.log('------- Initializing Repositories -------');
    this.shippingRepository = new ShippingRepository(this.dynamoDb.getInstance());
    this.customerRepository = new CustomerRepository(this.dynamoDb.getInstance());
    this.salaryBalanceRepository = new SalaryBalanceRepository(this.dynamoDb.getInstance());
    this.salaryRecordRepository = new SalaryRecordRepository(this.dynamoDb.getInstance());
    console.log('------- Repositories Initialized -------');
  
  }

  public initializeUseCases() {
    console.log('------- Initializing Use Cases -------');
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
     this.getShipping = new GetShippingUsecase(this.shippingRepository);
    console.log('------- Use Cases Initialized -------');

  }

  public initializeDelivers() {
    console.log('------- Initializing Delivers -------');
    if (!this.createCustomer || !this.addShipping || !this.addRecord || !this.getCustomer || !this.getAvailableCredit || !this.getShipping) {
      throw new Error("Use cases must be initialized before delivers");
    }
    new CustomerPostDelivers(this.createCustomer, this.addShipping, this.addRecord).registerRoutes(this.server.getServer());
    new CustomerGetDeliver(this.getCustomer, this.getAvailableCredit, this.getShipping).registerRoutes(this.server.getServer());
    new HealthGetDeliver().registerRoutes(this.server.getServer());
    console.log('------- Delivers Initialized -------');
  }

  public async initializeDynamoDb() {
    console.log('------- Initializing DynamoDB -------');
    await this.dynamoDb.ensureTableExists([
      CustomerRepository.getCustomerDefinition(), 
      SalaryBalanceRepository.getCustomerDefinition(), 
      SalaryRecordRepository.getCustomerDefinition(), 
      ShippingRepository.getCustomerDefinition()]);
    console.log('------- DynamoDB Initialized -------');
  }


}