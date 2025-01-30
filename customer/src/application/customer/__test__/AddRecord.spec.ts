import 'reflect-metadata'
import { Currency, RecordType } from "../../../domain/entities/SalaryRecord";
import { ISalaryBalanceRepository } from "../../../domain/repositories/ISalaryBalance.repository";
import { ISalaryRecordRepository } from "../../../domain/repositories/ISalatyRecord";

import { AddRecordUsecase } from "../AddRecord";
import { SalaryRecordReq } from "../../../infrastructure/common/dto/salaryRecord.dto";
import { ISalaryBalance, SalaryBalance } from '../../../domain/entities/SalaryBalance';

describe('AddRecordUsecase', () => {

  const mockSalaryRecordRepo = {
    createSalaryRecord: jest.fn()
  };
  const mockSalaryBalanceRepo = {
    getSalaryBalance: jest.fn(),
    updateSalaryBalance: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Successfully creates salary record and updates balance when valid data is provided
  it('should create salary record and update balance when valid data provided', async () => {

    const salaryRecord = new SalaryRecordReq(
      'customer-1',
      1000,
      Currency.USD,
      RecordType.WITHDRAWAL,
      'Salary payment',
      'record-1'
    );


    const mockBalance = SalaryBalance.fromJSON({
      customerId: 'customer-1',
      balance: 0,
      currency: Currency.USD,
      lastUpdated: new Date().toISOString(),
      lastRecordId: 'record-1',
      createdAt: new Date().toISOString(),
    });

    const mockBalanceUpdated = SalaryBalance.fromJSON({
      ...mockBalance.toJSON(),
      balance: -1000,
      lastUpdated: new Date().toISOString(),
    });
    const salaryRecordMock = salaryRecord.toSalaryRecord();
    mockSalaryBalanceRepo.getSalaryBalance.mockResolvedValue(mockBalance);
    mockSalaryRecordRepo.createSalaryRecord.mockResolvedValue(salaryRecordMock);
    mockSalaryBalanceRepo.updateSalaryBalance.mockResolvedValue(mockBalanceUpdated);

    const usecase = new AddRecordUsecase(
      mockSalaryRecordRepo as unknown as ISalaryRecordRepository,
      mockSalaryBalanceRepo as unknown as ISalaryBalanceRepository
    );

    const result = await usecase.execute(salaryRecord);

    expect(mockSalaryBalanceRepo.getSalaryBalance).toHaveBeenCalledWith('customer-1');
    expect(mockSalaryRecordRepo.createSalaryRecord).toHaveBeenCalled()
    expect(mockSalaryBalanceRepo.updateSalaryBalance).toHaveBeenCalled()


    expect(result.customerId).toBe('customer-1');
    expect(result.balance).toBe(-1000);
    expect(result.lastUpdated).toBeDefined();
    expect(result.currency).toBe(Currency.USD);
  });

  // Throws error when salary balance not found for customer
  it('should throw error when salary balance not found', async () => {
   
    const salaryRecord = new SalaryRecordReq(
      'customer-1',
      1000,
      Currency.USD,
      RecordType.DEPOSIT,
      'Salary payment'
    );
    mockSalaryBalanceRepo.getSalaryBalance.mockResolvedValue(null);
    const usecase = new AddRecordUsecase(
      mockSalaryRecordRepo as unknown as ISalaryRecordRepository,
      mockSalaryBalanceRepo as unknown as ISalaryBalanceRepository
    );
    await expect(usecase.execute(salaryRecord)).rejects.toThrow('Salary balance not found');
    expect(mockSalaryBalanceRepo.getSalaryBalance).toHaveBeenCalledWith('customer-1');
    expect(mockSalaryRecordRepo.createSalaryRecord).not.toHaveBeenCalled();
  });
});
