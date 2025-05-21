import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Product } from 'api/models/product.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ProductService extends CRUD<Product> {
  constructor(
    @Inject(Product.name)
    productModel: Model<Product>,
  ) {
    super(Product, productModel);
  }
}
