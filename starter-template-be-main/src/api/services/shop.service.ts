import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Shop } from 'api/models/shop.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ShopService extends CRUD<Shop> {
  constructor(@Inject(Shop.name) shopModel: Model<Shop>) {
    super(Shop, shopModel);
  }
}
