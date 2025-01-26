export interface IPerson {
  firstName: string;
  lastName: string;
  birthDate?: Date;
  documentType?: string;
  documentNumber?: string;
  nationality?: string;
}

export class Person extends BaseObject<IPerson> {
  public firstName: string;
  public lastName: string;
  public birthDate?: Date;
  public documentType?: string;
  public documentNumber?: string;
  public nationality?: string;
  constructor(
    payload: IPerson
  ) {
    super();
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.birthDate = payload.birthDate;
    this.documentType = payload.documentType;
    this.documentNumber = payload.documentNumber;
    this.nationality = payload.nationality;
  }

  getFullName(): string {
      return `${this.firstName} ${this.lastName}`;
  }

  toJSON(): IPerson {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      nationality: this.nationality,
    };
  }

}