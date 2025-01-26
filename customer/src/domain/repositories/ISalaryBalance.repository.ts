import { SalaryBalance } from "../entities/SalaryBalance";

export interface ISalaryBalanceRepository {
  getSalaryBalance(customerId: string): Promise<SalaryBalance>;
  updateSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance>;
  createSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance>;
  deleteSalaryBalance(customerId: string): Promise<void>;
}