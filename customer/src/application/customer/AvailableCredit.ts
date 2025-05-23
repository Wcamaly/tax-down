import { SalaryBalance } from "../../domain/entities/SalaryBalance";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";

export class AvailableCreditUsecase {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly salaryBalanceRepository: ISalaryBalanceRepository,
  ) {}

  async execute(cognitoId: string): Promise<SalaryBalance> {
    const customer = await this.customerRepository.getCustomer(cognitoId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const salaryBalance = await this.salaryBalanceRepository.getSalaryBalance(customer.id);
    return salaryBalance;
  }
}