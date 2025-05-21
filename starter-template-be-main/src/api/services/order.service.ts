import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Order } from 'api/models/order.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class OrderService extends CRUD<Order> {
  constructor(
    @Inject(Order.name)
    orderModel: Model<Order>,
  ) {
    super(Order, orderModel);
  }
}
