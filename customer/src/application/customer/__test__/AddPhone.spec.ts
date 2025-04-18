import 'reflect-metadata'
import { PhoneReq } from "../../../infrastructure/common/dto/customer.dto";
import { AddPhoneUsecase } from "../AddPhone";

describe('AddPhoneUsecase', () => {
  const mockCustomerRepository = {
    getCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    createCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
    getCustomerByCognitoId: jest.fn()
  };

  // Successfully add phone to existing customer and update in repository
  it('should add phone to customer and update repository when customer exists', async () => {

    const existingCustomer = {
      addPhone: jest.fn()
    };

    mockCustomerRepository.getCustomer.mockResolvedValue(existingCustomer);
    mockCustomerRepository.updateCustomer.mockResolvedValue(existingCustomer);

    const usecase = new AddPhoneUsecase(mockCustomerRepository);
    const phone = new PhoneReq('1234567890', '+1');

    const result = await usecase.execute('cognito-123', phone);

    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith('cognito-123');
    expect(existingCustomer.addPhone).toHaveBeenCalledWith(phone.toPhone());
    expect(mockCustomerRepository.updateCustomer).toHaveBeenCalledWith(existingCustomer);
    expect(result).toBe(existingCustomer);
  });

  // Handle non-existent customer (throw error)
  it('should throw error when customer does not exist', async () => {
  

    mockCustomerRepository.getCustomer.mockResolvedValue(null);

    const usecase = new AddPhoneUsecase(mockCustomerRepository);
    const phone = new PhoneReq('1234567890', '+1');

    await expect(usecase.execute('cognito-123', phone))
      .rejects
      .toThrow('Customer not found');
  
    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith('cognito-123');
  });
});
