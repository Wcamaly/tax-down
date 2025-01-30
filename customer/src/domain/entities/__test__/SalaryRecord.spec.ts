// Generated by Qodo Gen

import { Currency, ISalaryRecord, RecordType, SalaryRecord } from "../SalaryRecord";

describe('SalaryRecord', () => {

  // Create SalaryRecord instance with all required fields
  it('should create SalaryRecord instance with all required fields when valid payload is provided', () => {
    const payload = {
      customerId: '123',
      amount: 1000,
      currency: Currency.USD,
      type: RecordType.DEPOSIT,
      description: 'Salary payment'
    };

    const salaryRecord = new SalaryRecord(payload);

    expect(salaryRecord.id).toBeDefined();
    expect(salaryRecord.customerId).toBe(payload.customerId);
    expect(salaryRecord.amount).toBe(payload.amount);
    expect(salaryRecord.currency).toBe(payload.currency);
    expect(salaryRecord.type).toBe(payload.type);
    expect(salaryRecord.description).toBe(payload.description);
    expect(salaryRecord.createdAt).toBeInstanceOf(Date);
  });

  // Create SalaryRecord with negative amount value
  it('should create SalaryRecord with negative amount when withdrawal type is provided', () => {
    const payload = {
      customerId: '123',
      amount: -500,
      currency: Currency.EUR,
      type: RecordType.WITHDRAWAL,
      description: 'Withdrawal'
    };

    const salaryRecord = new SalaryRecord(payload);

    expect(salaryRecord.amount).toBe(payload.amount);
    expect(salaryRecord.type).toBe(RecordType.WITHDRAWAL);
  });

  it ('should toJSON return the salary record data', () => {
    const payload = {
      id: '123',
      customerId: '123',
      amount: 1000,
      currency: Currency.USD,
      type: RecordType.DEPOSIT,
      description: 'Salary payment',
      createdAt: new Date('2023-01-01').toISOString()
    };
    const salaryRecord = new SalaryRecord(payload);
    expect(salaryRecord.toJSON()).toEqual(payload);
  })

  it ('should fromJSON return the salary record instance', () => {
    const payload = {
      id: '123',
      customerId: '123',
      amount: 1000,
      currency: Currency.USD,
      type: RecordType.DEPOSIT,
      description: 'Salary payment',
      createdAt: new Date('2023-01-01').toISOString()
    };
    const salaryRecord = SalaryRecord.fromJSON(payload);
    expect(salaryRecord.id).toBe(payload.id);
    expect(salaryRecord.customerId).toBe(payload.customerId);
    expect(salaryRecord.amount).toBe(payload.amount);
    expect(salaryRecord.currency).toBe(payload.currency);
    expect(salaryRecord.type).toBe(payload.type);
    expect(salaryRecord.description).toBe(payload.description);
    expect(salaryRecord.createdAt).toStrictEqual(new Date(payload.createdAt));
  })

  it ('should throw error when creating SalaryRecord with missing required fields', () => {
    const invalidPayload = {
      customerId: '123',
      amount: 1000
    };

    expect(() => {
      new SalaryRecord(invalidPayload as unknown as ISalaryRecord);
    }).toThrow();
  });

});
