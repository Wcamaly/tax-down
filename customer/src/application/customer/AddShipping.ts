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
    try{
      const customer = await this.customerRepository.getCustomer(customerId);
      if (customer) {
        const newShipping = shipping.toShipping()
        newShipping.customerId = customerId;
        return this.shippingRepository.createShipping(newShipping);
      }
      throw new Error("Customer not found");
    } catch (error) {
      throw new Error("Customer not found");
    }
  }
}