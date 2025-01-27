import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { PhoneReq } from "../../infrastructure/common/dto/customer.dto";

export class AddPhoneUsecase {

  constructor(
    private readonly customerRepository: ICustomerRepository
  ){}

  async execute(cognitoId: string, phone:PhoneReq ) {
    const customer = await this.customerRepository.getCustomer(cognitoId);
    if(customer){
      customer.addPhone(phone.toPhone());
      await this.customerRepository.updateCustomer(customer);
      return customer;
    }
    throw new Error("Customer not found");
  }
}