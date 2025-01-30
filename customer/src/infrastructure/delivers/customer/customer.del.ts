import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { DeleteCustomerUsecase } from "../../../application/customer/DeleteCustomer";

export class CustomerDeleteDeliver {
  constructor(
    private readonly deleteCustomerUsecase: DeleteCustomerUsecase,
  ) {}

  private async deleteCustomer(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const customer = await this.deleteCustomerUsecase.execute(customerId);
    res.status(200).send(customer);
  }

  public async registerRoutes(app: FastifyInstance): Promise<void> {
    app.delete('/customer/:customerId', this.deleteCustomer.bind(this));
  }
}
