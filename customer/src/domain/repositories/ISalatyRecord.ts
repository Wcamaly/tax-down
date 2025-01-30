import { SalaryRecord } from "../entities/SalaryRecord";

export interface ISalaryRecordRepository {
  deleteSalaryRecord(customerId: string): Promise<void>;
  getSalaryRecord(customerId: string): Promise<Array<SalaryRecord>>;
  createSalaryRecord(salaryRecord: SalaryRecord): Promise<SalaryRecord>;
}