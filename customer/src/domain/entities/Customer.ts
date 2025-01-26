import { Contact, IContact, IPhone } from "../objects/Contact";
import { IPerson, Person } from "../objects/Person";
import { EntityBase } from "./EntityBase";

export interface ICustomer {
  id?: string;
  cognitoId: string,  
  person: IPerson, 
  contact: IContact,  
  shippingIds: string[], 
  orderIds: string[],  
  createdAt?: Date;
}


export class Customer extends EntityBase<Customer, ICustomer> {
  cognitoId: string
  person: Person
  contact: Contact
  shippingIds: string[]
  orderIds: string[]
  createdAt?: Date;

  constructor(customer: ICustomer) {
    super(customer.id);
    this.cognitoId = customer.cognitoId;
    this.person = Person.fromJSON(customer.person)  ;
    this.contact = Contact.fromJSON(customer.contact);
    this.shippingIds = customer.shippingIds;
    this.orderIds = customer.orderIds;
    this.createdAt = customer.createdAt ?? new Date();
  }

  
  toJSON(): ICustomer {
    return {
      cognitoId: this.cognitoId,
      person: this.person.toJSON(),
      contact: this.contact.toJSON(),
      shippingIds: this.shippingIds,
      orderIds: this.orderIds,
      createdAt: this.createdAt
    };
  }

  addContact(contact: Contact): void {
    this.contact = contact;
  }

  addPerson(person: Person): void {
    this.person = person;
  }

  addPhone(phone: IPhone): void {
    this.contact.addPhone(phone);
  }

}

