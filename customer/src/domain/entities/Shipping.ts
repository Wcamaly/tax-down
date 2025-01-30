import { EntityBase } from "./EntityBase";

export interface IShipping {
  customerId: string,
  id?: string,
  addressLine: string,
  city: string,
  state: string,
  country: string,
  postalCode: string,
  isDefault?: number
}

export class Shipping extends EntityBase<Shipping, IShipping> {
  customerId: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  constructor(
      payload : IShipping
  ) {
    super(payload.id)
    this.customerId = payload.customerId
    this.addressLine = payload.addressLine
    this.city = payload.city
    this.state = payload.state
    this.country = payload.country
    this.postalCode = payload.postalCode
    this.isDefault = payload.isDefault ? true : false
  }


  toJSON(): IShipping {
    return {
      customerId: this.customerId,
      id: this.id,
      addressLine: this.addressLine,
      city: this.city,
      state: this.state,
      country: this.country,
      postalCode: this.postalCode,
      isDefault: this.isDefault ? 1 : 0
    }
  }
}
