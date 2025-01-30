import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";

export class DeleteCustomerUsecase {
  constructor(
    private readonly customerRepository: ICustomerRepository, 
    private readonly salaryBalanceRepository: ISalaryBalanceRepository, 
    private readonly salaryRecordRepository: ISalaryRecordRepository ) {}

  async execute(customerId: string): Promise<Record<string, boolean | string>> {
    await this.customerRepository.deleteCustomer(customerId);
    await this.salaryBalanceRepository.deleteSalaryBalance(customerId);
    await this.salaryRecordRepository.deleteSalaryRecord(customerId);
    return {
      success: true,
      message: "Customer deleted successfully",
    };
  }
}
