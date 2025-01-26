import { v4 as uuidv4 } from 'uuid';

export abstract class EntityBase<T, R> extends BaseObject<R> {
  id: string;
  constructor(id?: string) {
    super();
    this.id = id ?? uuidv4();
  }
}
