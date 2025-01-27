// Generated by Qodo Gen

import { GetCustomerUsecase } from "../GetCustomer";

describe('GetCustomerUsecase', () => {

  // Returns customer data when valid cognitoId is provided
  it('should return customer data when valid cognitoId is provided', async () => {
    const mockCustomer = {
      id: '123',
      cognitoId: 'valid-cognito-id',
      name: 'John Doe'
    };

    const mockCustomerRepository = {
      getCustomer: jest.fn().mockResolvedValue(mockCustomer),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      deleteCustomer: jest.fn()
    };

    const getCustomerUsecase = new GetCustomerUsecase(mockCustomerRepository);

    const result = await getCustomerUsecase.execute('valid-cognito-id');

    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith('valid-cognito-id');
    expect(result).toEqual(mockCustomer);
  });

  // Handle empty cognitoId string
  it('should return null when empty cognitoId is provided', async () => {
    const mockCustomerRepository = {
      getCustomer: jest.fn().mockResolvedValue(null),
      createCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      deleteCustomer: jest.fn()
    };

    const getCustomerUsecase = new GetCustomerUsecase(mockCustomerRepository);

    const result = await getCustomerUsecase.execute('');

    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });
});
