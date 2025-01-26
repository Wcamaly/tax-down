import { EntityBase } from "./EntityBase";
import { RecordType, SalaryRecord } from "./SalaryRecord";

export interface ISalaryBalance {
  id?: string;
  customerId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export class SalaryBalance extends EntityBase<SalaryBalance, ISalaryBalance> {
  customerId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
  constructor(
    payload: ISalaryBalance
  ) {
    super(payload.id);
    this.customerId = payload.customerId;
    this.balance = payload.balance;
    this.currency = payload.currency;
    this.lastUpdated = payload.lastUpdated;
  }

  updateBalance(salaryRecord: SalaryRecord): SalaryBalance {
    if (salaryRecord.type === RecordType.DEPOSIT) {
      this.balance = this.balance + salaryRecord.amount;
    } else {
      this.balance = this.balance - salaryRecord.amount;
    }
    this.lastUpdated = new Date();
    return this;
  }

  toJSON(): ISalaryBalance {
    return {
      id: this.id,
      customerId: this.customerId,
      balance: this.balance,
      currency: this.currency,
      lastUpdated: this.lastUpdated
    }
  }
}
