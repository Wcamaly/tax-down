import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { ContactReq } from "../../infrastructure/common/dto/customer.dto";

export class AddContactUsecase{

  constructor(
    private readonly customerRepository: ICustomerRepository
  ){}

  async execute(cognitoId: string, contact:ContactReq ) {
    const customer = await this.customerRepository.getCustomer(cognitoId);
    if(customer){
      customer.addContact(contact.toContact());
      await this.customerRepository.updateCustomer(customer);
      return customer;
    }
    throw new Error("Customer not found");
  }
}