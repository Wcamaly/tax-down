import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AvailableCreditUsecase } from "../../../application/customer/AvailableCredit";
import { GetCustomerUsecase } from "../../../application/customer/GetCustomer";
import { GetShippingUsecase } from "../../../application/customer/GetShipping";


export class CustomerGetDeliver {
  constructor(
    private readonly getCustomerUsecase: GetCustomerUsecase,
    private readonly avaliableCreditUsecase: AvailableCreditUsecase,
    private readonly getShippingUsecase: GetShippingUsecase,
  ) {}

  private async getCustomerByCognitoId(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { cognitoId } = req.params as { cognitoId: string };
    const customer = await this.getCustomerUsecase.execute(cognitoId);
    res.send(customer || { message: 'Customer exists' });
  }

  private async getCustomerById(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const customer = await this.getCustomerUsecase.execute(customerId);
    res.send(customer);
  }

  private async getAvailableCredit(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const credit = await this.avaliableCreditUsecase.execute(customerId);
    res.send(credit);
  }

  private async getShipping(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const shipping = await this.getShippingUsecase.execute(customerId);
    res.send(shipping);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get('/customer/:customerId' , this.getCustomerById.bind(this));
    server.get('/customer/user/:cognitoId', this.getCustomerByCognitoId.bind(this));
    server.get('/customer/:customerId/credit' ,this.getAvailableCredit.bind(this));
    server.get('/customer/:customerId/shipping' ,this.getShipping.bind(this));
  }

}