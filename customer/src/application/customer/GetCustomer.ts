import { Customer } from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";

export class GetCustomerUsecase {

  constructor(
    private readonly customerRepository: ICustomerRepository
  ){}

  async execute(coggnitoId: string): Promise<Customer | null> {
    return this.customerRepository.getCustomer(coggnitoId);
  }
}