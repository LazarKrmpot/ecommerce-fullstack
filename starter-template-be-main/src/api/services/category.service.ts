import { Category } from 'api/models/category.model';
import { Product } from 'api/models/product.model';
import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class CategoryService extends CRUD<Category> {
  constructor(
    @Inject(Category.name) categoryModel: Model<Category>,
    @Inject(Product.name) private productModel: Model<Product>,
  ) {
    super(Category, categoryModel);
  }

  public async delete(id: string) {
    // Delete all products in this category
    await this.productModel.deleteMany({ categoryId: id });
    // Delete the category
    return super.delete(id);
  }
}
