import { IsBoolean, IsString } from "class-validator";
import { IShipping, Shipping } from "../../../domain/entities/Shipping";

export class ShippingDto implements IShipping {
  @IsString()
  customerId!: string;
  @IsString()
  id?: string | undefined;
  @IsString()
  addressLine!: string;
  @IsString()
  city!: string;
  @IsString()
  state!: string;
  @IsString()
  country!: string;
  @IsString()
  postalCode!: string;
  @IsBoolean()
  isDefault?: boolean;
}


export class ShippingReq {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly zip: string,
    public readonly isDefault: boolean = false

  ){}

  static fromDto(dto: ShippingDto): ShippingReq {
    return new ShippingReq(
      dto.addressLine,
      dto.city,
      dto.state,
      dto.country,
      dto.postalCode
    )
  }

  toShipping(): Shipping {
    return new Shipping({
      addressLine: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      postalCode: this.zip,
      isDefault: false,
      customerId: ''
    })
  }
}