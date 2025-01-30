import { request } from './jest.setup';
import { v4 as uuidv4 } from 'uuid';

export enum Currency {
  USD = "USD",
  EUR = "EUR"
}

export enum RecordType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL"
}


describe('Customer Endpoints', () => {
  const cognitoId: string = uuidv4();
  let customerId: string;

  it('should check health status', async () => {
    const response = await request
      .get('/health')
      .expect(200);
    
    expect(response.body.data).toEqual({ status: 'ok', message: 'Health check passed' })
  });

  
  it('should create a new customer', async () => {
    const response = await request
      .post('/customer')
      .send({
        "cognitoId": cognitoId,
        "person": {
            "firstName": "Walter",
            "lastName": "Camaly"
        },
        "contact": {
            "mainEmail": "test@test.com",
            "phones": []
        },
        "shippingIds": [],
        "orderIds" : []
    })
      .expect(200);

    expect(response.body.data).toHaveProperty('id');
    customerId = response.body.data.id; // Guarda el ID para usarlo en otras pruebas
  });

  
  it('should get customer details', async () => {
    const response = await request
      .get(`/customer/${customerId}`)
      .expect(200);

    expect(response.body.data).toHaveProperty('id', customerId);
    expect(response.body.data).toHaveProperty('person', {
      "firstName": "Walter",
      "lastName": "Camaly"
    });
    expect(response.body.data).toHaveProperty('contact', {
      "mainEmail": "test@test.com"
    });
  });


  it('should add salary record', async () => {
    const response = await request
      .post(`/customer/${customerId}/salary-record`)
      .send({
        customerId: customerId,
        amount: 1000,
        currency: Currency.USD,
        type: RecordType.DEPOSIT,
        description: "Test"
      })
      .expect(200);
  });
 
  it('should get customer credit', async () => {
    const response = await request
      .get(`/customer/${customerId}/credit`)
      
    expect(response.body.data).toHaveProperty('balance', 1000);
    expect(response.body.data).toHaveProperty('currency', Currency.USD);
    expect(response.body.data).toHaveProperty('lastUpdated', expect.any(String));
  });

 
  it('should less salary record', async () => {
    const response = await request
      .post(`/customer/${customerId}/salary-record`)
      .send({
        customerId: customerId,
        amount: 500,
        currency: Currency.USD,
        type: RecordType.WITHDRAWAL,
        description: "Test"
      })
      .expect(200);

    expect(response.body.data).toHaveProperty('currency', Currency.USD);
    expect(response.body.data).toHaveProperty('lastUpdated', expect.any(String));
  });

  it('should get customer available credit', async () => {
    const response = await request
      .get(`/customer/${customerId}/credit`)
      .expect(200);

    expect(response.body.data).toHaveProperty('balance', 500);
    expect(response.body.data).toHaveProperty('currency', Currency.USD);
    expect(response.body.data).toHaveProperty('lastUpdated', expect.any(String));
  });

  it('should add shipping address', async () => {
    const response = await request
      .post(`/customer/${customerId}/shipping`)
      .send({
        customerId: customerId,
        addressLine: '123 Main St',
        city: 'city',
        state: 'state',
        country: 'country',
        postalCode: 'postalCode',
        isDefault: 1 
      }).expect(200);
   
    expect(response.body.data).toHaveProperty('addressLine', '123 Main St');
    expect(response.body.data).toHaveProperty('city', 'city');
    expect(response.body.data).toHaveProperty('state', 'state');
    expect(response.body.data).toHaveProperty('country', 'country');
    expect(response.body.data).toHaveProperty('postalCode', 'postalCode');
    expect(response.body.data).toHaveProperty('isDefault', 1);
  });

  it('should get customer shipping', async () => {
    const response = await request
      .get(`/customer/${customerId}/shipping`)
      .expect(200);    
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('addressLine', '123 Main St');
    expect(response.body.data[0]).toHaveProperty('city', 'city');
    expect(response.body.data[0]).toHaveProperty('state', 'state');
    expect(response.body.data[0]).toHaveProperty('country', 'country');
    expect(response.body.data[0]).toHaveProperty('postalCode', 'postalCode');
    expect(response.body.data[0]).toHaveProperty('isDefault', 1);
  });

  it('delete customer', async () => {
    const response = await request
      .delete(`/customer/${customerId}`)
      .expect(200);

    expect(response.body.data).toEqual({"message": "Customer deleted successfully", "success": true});
  });

  it('should get customer not found', async () => {
    const response = await request
      .get(`/customer/${customerId}`).expect(200)

    expect(response.body.data).toBe(null);
    
  }); 
  
});
