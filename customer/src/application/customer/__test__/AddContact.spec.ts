import 'reflect-metadata'
import { ICustomerRepository } from "../../../domain/repositories/ICustomer.repository";
import { ContactReq } from "../../../infrastructure/common/dto/customer.dto";
import { AddContactUsecase } from "../AddContact";

describe('AddContactUsecase', () => {

  const mockCustomerRepo = {
    getCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    createCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
    getCustomerByCognitoId: jest.fn()
  };

  
  // Successfully add contact when customer exists and contact data is valid
  it('should add contact and update customer when customer exists', async () => {

    const existingCustomer = {
      addContact: jest.fn()
    };

    mockCustomerRepo.getCustomer.mockResolvedValue(existingCustomer);
    mockCustomerRepo.updateCustomer.mockResolvedValue(existingCustomer);

    const usecase = new AddContactUsecase(mockCustomerRepo);

    const contactReq = new ContactReq('test@email.com', []);
    const result = await usecase.execute('cognitoId123', contactReq);

    expect(mockCustomerRepo.getCustomer).toHaveBeenCalledWith('cognitoId123');
    expect(existingCustomer.addContact).toHaveBeenCalled();
    expect(mockCustomerRepo.updateCustomer).toHaveBeenCalledWith(existingCustomer);
    expect(result).toBe(existingCustomer);
  });

  // Throw error when customer is not found for given cognitoId
  it('should throw error when customer is not found', async () => {
    
    mockCustomerRepo.getCustomer.mockResolvedValue(null);

    const usecase = new AddContactUsecase(mockCustomerRepo);

    const contactReq = new ContactReq('test@email.com', []);

    await expect(usecase.execute('invalidId', contactReq))
      .rejects
      .toThrow('Customer not found');

    expect(mockCustomerRepo.getCustomer).toHaveBeenCalledWith('invalidId');
  });
});
