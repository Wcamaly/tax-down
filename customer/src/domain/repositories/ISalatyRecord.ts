import { SalaryRecord } from "../entities/SalaryRecord";

export abstract class ISalaryRecordRepository {
  abstract getSalaryRecord(customerId: string): Promise<Array<SalaryRecord>>;
  abstract createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord>;
}