import { Shipping } from "../../domain/entities/Shipping";
import { IShippingRepository } from "../../domain/repositories/IShipping.repository";

export class GetShippingUsecase {
  constructor(
    private readonly shippingRepository: IShippingRepository,
  ) {}

  public async execute(customerId: string): Promise<Shipping[]> {
    return this.shippingRepository.getShippings(customerId);
  }
}