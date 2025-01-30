import { ShippingReq } from "../../../infrastructure/common/dto/shipping.dto";
import { AddShippingUsecase } from "../AddShipping";

describe('AddShippingUsecase', () => {

  // Successfully create shipping address for existing customer
  it('should create shipping address when customer exists', async () => {
    const mockCustomerRepo = {
      getCustomer: jest.fn().mockResolvedValue({ id: 'customer-1' })
    };
    const mockShippingRepo = {
      createShipping: jest.fn().mockResolvedValue({
        id: 'shipping-1',
        customerId: 'customer-1',
        addressLine: '123 Main St',
        city: 'Test City',
        state: 'TS',
        country: 'Test Country',
        postalCode: '12345',
        isDefault: false
      })
    };
    const usecase = new AddShippingUsecase(mockCustomerRepo as any, mockShippingRepo as any);
    const shippingReq = new ShippingReq('123 Main St', 'Test City', 'TS', 'Test Country', '12345');
    const result = await usecase.execute('customer-1', shippingReq);
    expect(mockCustomerRepo.getCustomer).toHaveBeenCalledWith('customer-1');
    expect(mockShippingRepo.createShipping).toHaveBeenCalled();
    expect(result.addressLine).toBe('123 Main St');
  });

  // Throw error when customer ID does not exist
  it('should throw error when customer is not found', async () => {
    const mockCustomerRepo = {
      getCustomer: jest.fn().mockResolvedValue(null)
    };
    const mockShippingRepo = {
      createShipping: jest.fn()
    };
    const usecase = new AddShippingUsecase(mockCustomerRepo as any, mockShippingRepo as any);
    const shippingReq = new ShippingReq('123 Main St', 'Test City', 'TS', 'Test Country', '12345');
    await expect(usecase.execute('invalid-id', shippingReq))
      .rejects
      .toThrow('Customer not found');
    expect(mockCustomerRepo.getCustomer).toHaveBeenCalledWith('invalid-id');
    expect(mockShippingRepo.createShipping).not.toHaveBeenCalled();
  });
});
