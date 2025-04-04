import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";

export class GetCustomerUsecase {

  constructor(
    private readonly customerRepository: ICustomerRepository
  ){}

  async execute(customerId: string): Promise<Customer | null> {
    return this.customerRepository.getCustomer(customerId);
  }
}