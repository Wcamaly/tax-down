import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { IShipping, Shipping } from "../../../domain/entities/Shipping";

export class ShippingDto implements IShipping {
  @IsString()
  customerId!: string;
  @IsString()
  @IsOptional()
  @ValidateIf((obj) => obj.id !== null && obj.id !== undefined)
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
  
  @IsNumber()
  @ValidateIf((obj) => obj.isDefault !== null)
  @IsOptional()
  isDefault?: number;
}


export class ShippingReq {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly zip: string,
    public readonly isDefault: boolean = false,
    public readonly customerId: string
  ){}

  static fromDto(dto: ShippingDto): ShippingReq {
    return new ShippingReq(
      dto.addressLine,
      dto.city,
      dto.state,
      dto.country,
      dto.postalCode,
      dto.isDefault ? true : false,
      dto.customerId
    )
  }

  toShipping(): Shipping {
    return new Shipping({
      addressLine: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      postalCode: this.zip,
      isDefault: this.isDefault ? 1 : 0,
      customerId: this.customerId
    })
  }
}