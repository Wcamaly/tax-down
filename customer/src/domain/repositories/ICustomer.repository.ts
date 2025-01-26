import { Customer } from "../entities/Customer";

export abstract class ICustomerRepository {
  abstract getCustomer(cognitoId: string): Promise<Customer>;
  abstract createCustomer(customer: Customer): Promise<Customer>;
  abstract updateCustomer(customer: Customer): Promise<Customer>;
  abstract deleteCustomer(id: string): Promise<void>;

}