import { IsArray, IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Customer } from "../../../domain/entities/Customer";
import { Currency, RecordType, SalaryRecord } from "../../../domain/entities/SalaryRecord";
import { Shipping } from "../../../domain/entities/Shipping";
import { Contact, IContact, IPhone } from "../../../domain/objects/Contact";
import { IPerson } from "../../../domain/objects/Person";
import { Type } from "class-transformer";

export class PersonDto implements IPerson {
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
  @IsDate()
  birthDate?: Date | undefined;
  @IsString()
  documentType?: string | undefined;
  @IsString()
  documentNumber?: string | undefined;
  @IsString()
  nationality?: string | undefined;
}

export class PhoneDto implements IPhone {
  @IsString()
  number!: string;
  @IsString()
  countryCode!: string;
}

export class ContactDto implements IContact {
  @IsString()
  mainEmail!: string;
  @ValidateNested()
  @Type(() => PhoneDto)
  phones?: IPhone[] | undefined;
  @IsString()
  secondaryEmail?: string | undefined;
}


export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  cognitoId!: string
  @ValidateNested()
  @Type(() => PersonDto)
  person!: IPerson
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: IContact
  @IsArray({each: true})
  shippingIds?: string[]
  @IsArray({each: true})
  orderIds?: string[]
}


export class CustomerReq {
  constructor(
    public readonly cognitoId: string,
    public readonly person: IPerson,
    public readonly contact: IContact,
    public readonly shippingIds: string[],
    public readonly orderIds: string[]) {
  }

  static fromDto(dto: CustomerDto): CustomerReq {
    return new CustomerReq(
      dto.cognitoId,
      dto.person,
      dto.contact as IContact,
      dto.shippingIds as string[],
      dto.orderIds as string[]
    )
  }


  toCustomer(): Customer{
    return new Customer({
      cognitoId: this.cognitoId,
      person: this.person,
      contact: this.contact,
      shippingIds: this.shippingIds,
      orderIds: this.orderIds
    });
  }
}

export class ContactReq  {
  constructor(
    public readonly mainEmail: string,
    public readonly phones: IPhone[],
    public readonly secondaryEmail?: string) {
  }


  toContact(): Contact {
    return new Contact({
      mainEmail: this.mainEmail,
      phones: this.phones,
      secondaryEmail: this.secondaryEmail
    });
  }
}

export class PhoneReq {
  constructor(
    public readonly number: string,
    public readonly countryCode: string,
  ){}

  toPhone(): IPhone {
    return {
      number: this.number,
      countryCode: this.countryCode
    }
  }
}



