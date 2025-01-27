import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";
import { ISalaryRecordRepository } from "../../domain/repositories/ISalatyRecord";
import { SalaryRecordReq } from "../../infrastructure/common/dto/salaryRecord.dto";


export class AddRecordUsecase {
  constructor(
    private readonly salaryRecordRepository: ISalaryRecordRepository,
    private readonly salaryBalanceRepository: ISalaryBalanceRepository
  ){}

  async execute(salaryRecord: SalaryRecordReq) {
    const salaryBalance = await this.salaryBalanceRepository.getSalaryBalance(salaryRecord.customerId);
    if (!salaryBalance) {
      throw new Error("Salary balance not found");
    }
    const nSalaryRecord = salaryRecord.toSalaryRecord();
    const record =await this.salaryRecordRepository.createSalaryRecord(nSalaryRecord);

    salaryBalance.updateBalance(record)
    await this.salaryBalanceRepository.updateSalaryBalance(salaryBalance);
    return record
  }
}