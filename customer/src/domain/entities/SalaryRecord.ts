import { EntityBase } from "./EntityBase";

export enum Currency {
  USD = "USD",
  EUR = "EUR"
}

export enum RecordType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL"
}

export interface ISalaryRecord {
  id?:string
  customerId: string;
  amount?: number;
  currency: Currency;
  type: RecordType;
  description: string;
  createdAt?: Date;
}

export class SalaryRecord extends EntityBase<SalaryRecord, ISalaryRecord> {

  customerId: string;
  amount: number;
  currency: Currency; 
  type: RecordType;
  description: string;
  createdAt?: Date;
     constructor(
        payload: ISalaryRecord
    ) {
        super(payload.id);
        if (!payload.customerId) {
            throw new Error('SalaryRecord must have a customerId');
        }

        if (!payload.currency) {
            throw new Error('SalaryRecord must have a currency');
        }

        this.customerId = payload.customerId;
        this.amount = payload.amount ?? 0;
        this.currency = payload.currency;
        this.type = payload.type;
        this.description = payload.description;
        this.createdAt = payload.createdAt ?? new Date();
    }

    toJSON(): ISalaryRecord {
        return {
            id: this.id,
            customerId: this.customerId,
            amount: this.amount,
            currency: this.currency,
            type: this.type,
            description: this.description,
            createdAt: this.createdAt
        }
    }
}