import { OmitType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Category } from 'api/models/category.model';
import { Roles } from 'api/models/user.model';
import { CategoryService } from 'api/services/category.service';
import { ProductService } from 'api/services/product.service';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import {
  Authorized,
  BadRequestError,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';

export class CreateCategory extends OmitType(Category, ['_id', '__v']) {
  @Exclude()
  @IsOptional()
  protected_: null;
}

class PutCategoryBody {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description: string;
}

@JsonController('/categories')
export class CategoryController {
  constructor(
    private categoriesService: CategoryService,
    private productService: ProductService,
  ) {}

  @Get('/')
  // @Authorized(Roles.ADMIN)
  public async getAllCategories() {
    const categories = await this.categoriesService.find({});
    if (categories.length === 0) {
      throw new BadRequestError('No categories found');
    }
    return { data: categories };
  }

  @Post('/')
  @Authorized(Roles.ADMIN)
  public async createCategory(@Body() body: CreateCategory) {
    const { name, description } = body;
    const existingCategories = await this.categoriesService.find({
      filter: { name: name },
    });
    if (existingCategories.length > 0) {
      throw new BadRequestError('Category already exists');
    }
    const createdCategory = await this.categoriesService.create({
      name,
      description,
    });

    const newCategory = await this.categoriesService.findOneById(
      createdCategory._id,
    );
    return { data: newCategory };
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  public async updateCategory(
    @Param('id') id: Ref<Category>,
    @Body() body: PutCategoryBody,
  ) {
    const { name, description } = body;
    await this.categoriesService.updateOneById(id, { name, description });
    return { message: 'Category updated successfully' };
  }

  @Delete('/:id')
  @Authorized(Roles.ADMIN)
  public async deleteCategory(@Param('id') id: Ref<Category>) {
    // First get the products that will be deleted
    const productsToDelete = await this.productService.find({
      filter: { categoryId: id },
    });

    await this.categoriesService.delete(id);

    return {
      message: 'Category deleted successfully',
      deletedProducts: productsToDelete,
    };
  }
}
