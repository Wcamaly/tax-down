import { Customer } from "../entities/Customer";

export interface ICustomerRepository {
  getCustomer(cognitoId: string): Promise<Customer | null>;
  createCustomer(customer: Customer): Promise<Customer>;
  updateCustomer(customer: Customer): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

}