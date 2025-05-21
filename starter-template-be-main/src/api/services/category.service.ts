import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Category } from 'api/models/category.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class CategoryService extends CRUD<Category> {
  constructor(@Inject(Category.name) categoryModel: Model<Category>) {
    super(Category, categoryModel);
  }
}
