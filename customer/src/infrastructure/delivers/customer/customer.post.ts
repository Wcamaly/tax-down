import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AddRecordUsecase } from "../../../application/customer/AddRecord";
import { AddShippingUsecase } from "../../../application/customer/AddShipping";
import { CreateCustomerUsecase } from "../../../application/customer/CreateCustomer";
import { Customer } from "../../../domain/entities/Customer";
import { SalaryRecord } from "../../../domain/entities/SalaryRecord";
import { Shipping } from "../../../domain/entities/Shipping";
import { CustomerDto, CustomerReq } from "../../common/dto/customer.dto";
import { Validate } from "../../common/middlewarer/validate";
import { IContact } from "../../../domain/objects/Contact";
import { ShippingDto, ShippingReq } from "../../common/dto/shipping.dto";
import { SalaryRecordDto, SalaryRecordReq } from "../../common/dto/salaryRecord.dto";

export class CustomerPostDelivers {
  constructor(
    private readonly createCustomerUsecase: CreateCustomerUsecase,
    private readonly addShippingUsecase: AddShippingUsecase,
    private readonly addRecordUsecase: AddRecordUsecase,
  ) {}
  
  
  private async createCustomer(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const validateBody = await Validate.validateDto<CustomerDto>(CustomerDto, req, res);
    if (!validateBody) {
      res.status(400).send({ error: "Invalid request body" });
      return
    }
    const customerReq =  CustomerReq.fromDto(validateBody);
    const customer = await this.createCustomerUsecase.execute(customerReq);
    res.status(200).send(customer);
    return
  }

  private async createShipping(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const validateBody = await Validate.validateDto<ShippingDto>(ShippingDto, req, res);
    if (!validateBody) {
      res.status(400).send({ error: "Invalid request body" });
      return
    }
    const shppingReq = ShippingReq.fromDto(validateBody);
    if (!validateBody) {
      res.status(400).send({ error: "Invalid request body" });
      return
    }
    const shipping = await this.addShippingUsecase.execute(customerId, shppingReq);
    res.status(200).send(shipping);
  }

  private async createSalaryRecord(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const validateBody = await Validate.validateDto<SalaryRecordDto>(SalaryRecordDto, req, res);
    if (!validateBody) {
      res.status(400).send({ error: "Invalid request body" });
      return
    }
    const salaryRecord = await this.addRecordUsecase.execute(SalaryRecordReq.fromDto(validateBody));
    res.status(200).send(salaryRecord);
  }

  public registerRoutes(server: FastifyInstance): void {
    server.post("/customer", this.createCustomer.bind(this));
    server.post("/customer/:customerId/shipping", this.createShipping.bind(this));
    server.post("/customer/:customerId/salary-record", this.createSalaryRecord.bind(this));
  }

}