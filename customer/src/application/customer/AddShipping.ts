import { Shipping } from "../../domain/entities/Shipping";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";
import { ShippingReq } from "../../infrastructure/common/dto/shipping.dto";


export class AddShippingUsecase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly shippingRepository: IShippingRepository
  ){}

  async execute(customerId:string,  shipping: ShippingReq): Promise<Shipping> {
    const customer = await this.customerRepository.getCustomer(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return this.shippingRepository.createShipping(shipping.toShipping());
    
  }
}