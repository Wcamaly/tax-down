import { EntityBase } from "./EntityBase";

export interface IShipping {
  customerId: string,
  id?: string,
  addressLine: string,
  city: string,
  state: string,
  country: string,
  postalCode: string,
  isDefault?: boolean
}

export class Shipping extends EntityBase<Shipping, IShipping> {
  readonly customerId: string;
  readonly addressLine: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly postalCode: string;
  readonly isDefault: boolean;
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
    this.isDefault = payload.isDefault ?? false
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
      isDefault: this.isDefault
    }
  }
}
