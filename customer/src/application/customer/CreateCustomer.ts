import { Customer } from "../../domain/entities/Customer";
import { ISalaryBalance, SalaryBalance } from "../../domain/entities/SalaryBalance";
import { ICustomerRepository } from "../../domain/repositories/ICustomer.repository";
import { ISalaryBalanceRepository } from "../../domain/repositories/ISalaryBalance.repository";
import { CustomerReq } from "../../infrastructure/common/dto/customer.dto";

export class CreateCustomerUsecase {

    constructor(
        private readonly customerRepository: ICustomerRepository,
        private readonly salaryBalanceRepository: ISalaryBalanceRepository,
    ) { }

    async execute(request: CustomerReq): Promise<Customer> {
        const customer = request.toCustomer();
        const salaryBalance = new SalaryBalance({ customerId: customer.id, balance: 0, currency: "USD" } as ISalaryBalance);
        await this.customerRepository.createCustomer(customer);
        await this.salaryBalanceRepository.createSalaryBalance(salaryBalance);
        return customer
    }
}