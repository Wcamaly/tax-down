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

  private async getCustomer(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const customer = await this.getCustomerUsecase.execute(customerId);
    res.status(200).send(customer);
  }

  private async getAvailableCredit(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const credit = await this.avaliableCreditUsecase.execute(customerId);
    res.status(200).send(credit);
  }

  private async getShipping(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const shipping = await this.getShippingUsecase.execute(customerId);
    res.status(200).send(shipping);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get('/customer/:customerId', this.getCustomer.bind(this));
    server.get('/customer/:customerId/credit', this.getAvailableCredit.bind(this));
    server.get('/customer/:customerId/shipping', this.getShipping.bind(this));
  }

}