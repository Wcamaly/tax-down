export abstract class BaseObject<R> {
  abstract toJSON(): R;
 /*  static fromJSON<W, T extends BaseObject<W>>(this: new (json: W) => T, json: W): T {
    return new this(json);
  } */

  static fromJSON<T extends BaseObject<any>, W>(
    this: new (...args: any[]) => T,
    json: W
  ): T {
    return new this(json);
  }
}