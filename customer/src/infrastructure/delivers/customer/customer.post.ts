import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AddRecordUsecase } from "../../../application/customer/AddRecord";
import { AddShippingUsecase } from "../../../application/customer/AddShipping";
import { CreateCustomerUsecase } from "../../../application/customer/CreateCustomer";
import { CustomerDto, CustomerReq } from "../../common/dto/customer.dto";
import { Validate } from "../../common/middlewarer/validate";

import { ShippingDto, ShippingReq } from "../../common/dto/shipping.dto";
import { SalaryRecordDto, SalaryRecordReq } from "../../common/dto/salaryRecord.dto";


export class CustomerPostDelivers {
  constructor(
    private readonly createCustomerUsecase: CreateCustomerUsecase,
    private readonly addShippingUsecase: AddShippingUsecase,
    private readonly addRecordUsecase: AddRecordUsecase,
  ) {}
  
  
  private async createCustomer(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const customerReq =  CustomerReq.fromDto(req.body as CustomerDto);
    const customer = await this.createCustomerUsecase.execute(customerReq);
    res.status(200).send(customer);
    return
  }

  private async createShipping(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const shppingReq = ShippingReq.fromDto(req.body as ShippingDto);
    if (!shppingReq) {
     throw new Error('Invalid shipping request');
    }
    const shipping = await this.addShippingUsecase.execute(customerId, shppingReq);
    res.status(200).send(shipping);
  }

  private async createSalaryRecord(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const { customerId } = req.params as { customerId: string };
    const salaryRecordDto = req.body as SalaryRecordDto;
    salaryRecordDto.customerId = customerId;
    const salaryRecord = await this.addRecordUsecase.execute(SalaryRecordReq.fromDto(salaryRecordDto));
    res.status(200).send(salaryRecord);
  }

  public registerRoutes(server: FastifyInstance): void {
    server.post("/customer",{preHandler: Validate.validateDto<CustomerDto>(CustomerDto)} ,this.createCustomer.bind(this));
    server.post("/customer/:customerId/shipping", {preHandler: Validate.validateDto<ShippingDto>(ShippingDto)},this.createShipping.bind(this));
    server.post("/customer/:customerId/salary-record",{preHandler: Validate.validateDto<SalaryRecordDto>(SalaryRecordDto)}, this.createSalaryRecord.bind(this));
  }

}