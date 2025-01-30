import { AddContactUsecase } from "../../application/customer/AddContact";
import { AddPhoneUsecase } from "../../application/customer/AddPhone";
import { AddRecordUsecase } from "../../application/customer/AddRecord";
import { AddShippingUsecase } from "../../application/customer/AddShipping";
import { AvailableCreditUsecase } from "../../application/customer/AvailableCredit";
import { CreateCustomerUsecase } from "../../application/customer/CreateCustomer";
import { DeleteCustomerUsecase } from "../../application/customer/DeleteCustomer";
import { GetCustomerUsecase } from "../../application/customer/GetCustomer";
import { GetShippingUsecase } from "../../application/customer/GetShipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";
import { CustomerDeleteDeliver } from "../delivers/customer/customer.del";
import { CustomerGetDeliver } from "../delivers/customer/customer.get";
import { CustomerPostDelivers } from "../delivers/customer/customer.post";
import { HealthGetDeliver } from "../delivers/health/health.get";
import { CustomerRepository } from "../repositories/Customer.dynamo";
import { SalaryBalanceRepository } from "../repositories/SalaryBalance.dynamo";
import { SalaryRecordRepository } from "../repositories/SalaryRecord.dynamo";
import { ShippingRepository } from "../repositories/Shipping.dynamo";
import { DynamoDb } from "./dynamoDb";
import { Server } from "./server";

export enum InstanceStatus {
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  ERROR = 'error'
}

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
  private deleteCustomer?: DeleteCustomerUsecase;


  private status: InstanceStatus = InstanceStatus.INITIALIZING;
  


  constructor(private readonly server: Server, private readonly dynamoDb: DynamoDb) {
    this.status = InstanceStatus.INITIALIZING;
  }


  public getStatus() {
    return this.status;
  }

  public setStatus(status: InstanceStatus) {
    this.status = status;
  }

  public initializeRepositories() {
    try{

   
      this.shippingRepository = new ShippingRepository(this.dynamoDb.getInstance());
      this.customerRepository = new CustomerRepository(this.dynamoDb.getInstance());
      this.salaryBalanceRepository = new SalaryBalanceRepository(this.dynamoDb.getInstance());
      this.salaryRecordRepository = new SalaryRecordRepository(this.dynamoDb.getInstance());
   
    } catch (error) {
      
      console.error( `Error Initializing Repositories: ${error}`);
      throw error;
    }
  
  }

  public initializeUseCases() {
    try{
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
      this.deleteCustomer = new DeleteCustomerUsecase(this.customerRepository, this.salaryBalanceRepository, this.salaryRecordRepository);
    } catch (error) {
      console.error( `Error Initializing Use Cases: ${error}`);
      throw error;
    }

  }

  public initializeDelivers() {
    try{
    
      if (!this.createCustomer || !this.addShipping || !this.addRecord || !this.getCustomer || !this.getAvailableCredit || !this.getShipping || !this.deleteCustomer) {
        throw new Error("Use cases must be initialized before delivers");
      }
      if (this.server.getServer().server.listening) {
        console.warn("⚠️ Warning: Fastify ya está escuchando. No se agregarán más rutas.");
        return;
      }

      new CustomerPostDelivers(this.createCustomer, this.addShipping, this.addRecord).registerRoutes(this.server.getServer());
      new CustomerGetDeliver(this.getCustomer, this.getAvailableCredit, this.getShipping).registerRoutes(this.server.getServer());
      new CustomerDeleteDeliver(this.deleteCustomer).registerRoutes(this.server.getServer());
      new HealthGetDeliver().registerRoutes(this.server.getServer());
      this.setStatus(InstanceStatus.INITIALIZED);
    } catch (error) {
      console.error( `Error Initializing Delivers: ${error}`);
      throw error;
    }
  }

  public async initializeDynamoDb() {
    
    
    try{
      this.setStatus(InstanceStatus.INITIALIZING);
      await this.dynamoDb.ensureTableExists([
        CustomerRepository.getCustomerDefinition(), 
        SalaryBalanceRepository.getCustomerDefinition(), 
        SalaryRecordRepository.getCustomerDefinition(), 
        ShippingRepository.getCustomerDefinition()]);
    } catch (error) {
      console.error( `Error Initializing DynamoDB: ${error}`);
      throw error;
    }
  }
}