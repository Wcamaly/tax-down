import { SalaryBalance } from "../entities/SalaryBalance";

export abstract class ISalaryBalanceRepository {
  abstract getSalaryBalance(customerId: string): Promise<SalaryBalance>;
  abstract updateSalaryBalance(salaryBalance: SalaryBalance): Promise<SalaryBalance>;
}