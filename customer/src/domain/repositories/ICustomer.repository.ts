import { Customer } from "../entities/Customer";

export interface ICustomerRepository {
  getCustomerByCognitoId(coggnitoId: string): Customer | PromiseLike<Customer | null> | null;
  getCustomer(customerId: string): Promise<Customer | null>;
  createCustomer(customer: Customer): Promise<Customer>;
  updateCustomer(customer: Customer): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

}