import { EntityBase } from "./EntityBase";
import { RecordType, SalaryRecord } from "./SalaryRecord";

export interface ISalaryBalance {
  id?: string;
  customerId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
  lastRecordId?: string;
  createdAt?: Date;
}

export class SalaryBalance extends EntityBase<SalaryBalance, ISalaryBalance> {
  customerId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
  lastRecordId?: string;
  createdAt?: Date;
  constructor(
    payload: ISalaryBalance
  ) {
    super(payload.id);
    this.customerId = payload.customerId;
    this.balance = payload.balance;
    this.currency = payload.currency;
    this.lastUpdated = payload.lastUpdated;
    this.lastRecordId = payload.lastRecordId;
    this.createdAt = payload.createdAt ?? new Date();
  }

  updateBalance(salaryRecord: SalaryRecord): SalaryBalance {
    if (salaryRecord.type === RecordType.DEPOSIT) {
      this.balance = this.balance + salaryRecord.amount;
    } else {
      this.balance = this.balance - salaryRecord.amount;
    }
    this.lastUpdated = new Date();
    this.lastRecordId = salaryRecord.id;
    return this;
  }

  toJSON(): ISalaryBalance {
    return {
      id: this.id,
      customerId: this.customerId,
      balance: this.balance,
      currency: this.currency,
      lastUpdated: this.lastUpdated,
      lastRecordId: this.lastRecordId,
      createdAt: this.createdAt
    }
  }
}
