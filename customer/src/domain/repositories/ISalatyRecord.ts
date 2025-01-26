import { SalaryRecord } from "../entities/SalaryRecord";

export interface ISalaryRecordRepository {
  getSalaryRecord(customerId: string): Promise<Array<SalaryRecord>>;
  createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord>;
}