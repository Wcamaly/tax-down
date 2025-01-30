import { BaseObject } from "./BaseObject";

export interface IPhone {
  number: string;
  countryCode: string;
}

export class Phone extends BaseObject<IPhone> {
  number: string
  countryCode: string
  constructor(
   payload: IPhone
  ) {
    super();
    this.number = payload.number;
    this.countryCode = payload.countryCode;
  }
  getFullPhone(): string {
    return `${this.countryCode} ${this.number}`;
  }
  toJSON(): IPhone {
    return {
      number: this.number,
      countryCode: this.countryCode
    }
  }
}

export interface IContact {
  mainEmail: string;
  phones?: IPhone[];
  secondaryEmail?: string;
}

export class Contact extends BaseObject<IContact> {
  public phones: Phone[];
  public secondaryEmail?: string;
  public mainEmail: string;
  constructor(
   payload: IContact
  ) {
    super();
    this.mainEmail = payload.mainEmail;
    this.phones = payload.phones ? payload.phones.map(p => new Phone(p)) : [];
    this.secondaryEmail = payload.secondaryEmail;
  }

  addPhone(phone: IPhone): void {
    this.phones.push(new Phone(phone));
  }

  removePhone(phone: IPhone): void {
    this.phones = this.phones.filter(p => p.number !== phone.number);
  }
  toJSON(): IContact {
    return {
      mainEmail: this.mainEmail,
      phones: this.phones && this.phones.length > 0 ? this.phones.map(p => p.toJSON()) : undefined,
      secondaryEmail: this.secondaryEmail
    }
  }

}
