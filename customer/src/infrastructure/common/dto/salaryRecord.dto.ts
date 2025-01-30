import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Currency, ISalaryRecord, RecordType, SalaryRecord } from "../../../domain/entities/SalaryRecord";

export class SalaryRecordDto implements ISalaryRecord {
  @IsString()
  customerId!: string;
  @IsNumber()
  @ValidateIf((obj) => obj.birthDate !== null)
  amount?: number | undefined;
  @IsEnum(Currency)
  currency!: Currency;
  @IsEnum(RecordType)
  type!: RecordType;
  @IsString()
  description!: string;
  @IsString()
  @ValidateIf((obj) => obj.birthDate !== null )
  @IsOptional()
  @IsString()
  createdAt?: string | undefined;
}


export class SalaryRecordReq {
  constructor(
    public readonly customerId: string,
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly type: RecordType,
    public readonly description: string,
    public readonly id?: string
  ){}

  static fromDto(dto: SalaryRecordDto): SalaryRecordReq {
    return new SalaryRecordReq(
      dto.customerId,
      dto.amount ?? 0,
      dto.currency,
      dto.type,
      dto.description,
      dto.createdAt
    )
  }


  toSalaryRecord(): SalaryRecord {
    return new SalaryRecord({
      id: this.id ?? undefined,
      customerId: this.customerId,
      amount: this.amount,
      currency: this.currency,
      type: this.type,
      description: this.description
    })
  }
}