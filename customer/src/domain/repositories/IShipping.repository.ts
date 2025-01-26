import { Shipping } from "../entities/Shipping";

export interface IShippingRepository {
  getShippings(customerId: string): Promise<Shipping[]>;
  createShipping(shipping: Shipping): Promise<Shipping>;
  updateShipping(shipping: Shipping): Promise<Shipping>;
  deleteShipping(shippingId: string): Promise<void>;
  getShippingDefault(customerId: string): Promise<Shipping | null>;
}