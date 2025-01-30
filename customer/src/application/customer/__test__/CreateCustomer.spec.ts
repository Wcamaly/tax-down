import 'reflect-metadata'
import { Customer } from "../../../domain/entities/Customer";
import { IContact } from "../../../domain/objects/Contact";
import { IPerson } from "../../../domain/objects/Person";
import { ICustomerRepository } from "../../../domain/repositories/ICustomer.repository";
import { ISalaryBalanceRepository } from "../../../domain/repositories/ISalaryBalance.repository";
import { CustomerReq } from "../../../infrastructure/common/dto/customer.dto";
import { CreateCustomerUsecase } from "../CreateCustomer";

describe('CreateCustomerUsecase', () => {

  // Successfully creates customer and salary balance with valid request data
  it('should create customer and salary balance when valid request is provided', async () => {
    const customerRepository = {
      createCustomer: jest.fn()
    } as unknown as ICustomerRepository;

    const salaryBalanceRepository = {
      createSalaryBalance: jest.fn()
    } as unknown as ISalaryBalanceRepository;

    const usecase = new CreateCustomerUsecase(customerRepository, salaryBalanceRepository);

    const request = new CustomerReq(
      'cognito-123',
      { firstName: 'John', lastName: 'Doe' },
      { mainEmail: 'john@example.com' },
      ['shipping-1'],
      []
    );

    const result = await usecase.execute(request);

    expect(customerRepository.createCustomer).toHaveBeenCalledWith(expect.any(Customer));
    expect(salaryBalanceRepository.createSalaryBalance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: result.id,
        balance: 0,
        currency: 'USD'
      })
    );
    expect(result).toBeInstanceOf(Customer);
  });

  // Handle request with missing required customer fields
  it('should throw error when customer request is missing required fields', async () => {
    const customerRepository = {
      createCustomer: jest.fn()
    } as unknown as ICustomerRepository;

    const salaryBalanceRepository = {
      createSalaryBalance: jest.fn()
    } as unknown as ISalaryBalanceRepository;

    const usecase = new CreateCustomerUsecase(customerRepository, salaryBalanceRepository);

    const invalidRequest = new CustomerReq(
      '',
      {} as IPerson,
      {} as IContact,
      [],
      []
    );

    await expect(usecase.execute(invalidRequest))
      .rejects
      .toThrow('Customer must have a cognitoId');

    expect(customerRepository.createCustomer).not.toHaveBeenCalled();
    expect(salaryBalanceRepository.createSalaryBalance).not.toHaveBeenCalled();
  });
});
