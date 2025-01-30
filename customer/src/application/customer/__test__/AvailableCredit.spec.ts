import { ISalaryBalance } from "../../../domain/entities/SalaryBalance";
import { Currency } from "../../../domain/entities/SalaryRecord";
import { AvailableCreditUsecase } from "../AvailableCredit";

describe('AvailableCreditUsecase', () => {

  // Returns correct available credit balance for existing customer with valid salary balance
  it('should return salary balance when customer exists', async () => {
    const mockCustomer = { id: 'customer-123' };
    const mockSalaryBalance : ISalaryBalance = {
      customerId: "customer-123",
      balance: 1000,
      currency: Currency.USD,
      lastUpdated: "2025-01-01"
    };

    const customerRepository = {
      getCustomer: jest.fn().mockResolvedValue(mockCustomer),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
      getCustomerByCognitoId: jest.fn().mockResolvedValue(mockCustomer)
    };

    const salaryBalanceRepository = {
      getSalaryBalance: jest.fn().mockResolvedValue(mockSalaryBalance),
      updateSalaryBalance: jest.fn(),
      createSalaryBalance: jest.fn(),
      deleteSalaryBalance: jest.fn(),
      getCustomerByCognitoId: jest.fn().mockResolvedValue(mockCustomer)
    };

    const usecase = new AvailableCreditUsecase(customerRepository, salaryBalanceRepository);

    const result = await usecase.execute('cognito-123');

    expect(customerRepository.getCustomer).toHaveBeenCalledWith('cognito-123');
    expect(salaryBalanceRepository.getSalaryBalance).toHaveBeenCalledWith('customer-123');
    expect(result.balance).toBe(1000);
  });

  // Throws error when customer not found
  it('should throw error when customer not found', async () => {
    const customerRepository = {
      getCustomer: jest.fn().mockResolvedValue(null),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
      getCustomerByCognitoId: jest.fn()
    };

    const salaryBalanceRepository = {
      getSalaryBalance: jest.fn(),
      updateSalaryBalance: jest.fn(),
      createSalaryBalance: jest.fn(),
      deleteSalaryBalance: jest.fn(),
      getCustomerByCognitoId: jest.fn()
    };

    const usecase = new AvailableCreditUsecase(customerRepository, salaryBalanceRepository);

    await expect(usecase.execute('cognito-123'))
      .rejects
      .toThrow('Customer not found');

    expect(customerRepository.getCustomer).toHaveBeenCalledWith('cognito-123');
  });
});
