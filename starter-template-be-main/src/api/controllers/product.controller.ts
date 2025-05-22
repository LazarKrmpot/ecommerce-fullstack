import * as fs from 'fs';

import { OmitType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Category } from 'api/models/category.model';
import { Currency, Product, ProductStatus } from 'api/models/product.model';
import { Shop } from 'api/models/shop.model';
import { Roles } from 'api/models/user.model';
import { ProductService } from 'api/services/product.service';
import { FilterQueryParams } from 'api/types/filter.types';
import { Exclude, Type, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import csv from 'csv-parser';
import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

export class ProductType extends OmitType(Product, ['shopId', 'categoryId']) {
  @ValidateNested()
  @Type(() => Shop)
  shopId: Shop;

  @ValidateNested()
  @Type(() => Category)
  categoryId: Category;
}

class createProductBody extends OmitType(Product, ['__v', '_id']) {
  @Exclude()
  @IsOptional()
  protected_: null;
}
class getAllProductsByShopResponse {
  @ValidateNested()
  @Type(() => Product)
  public data: Product;
}

class ProductStatsResponse {
  @ValidateNested()
  @Type(() => Object)
  data: {
    totalProducts: number;
    totalFeatured: number;
    totalInStock: number;
    totalOutOfStock: number;
  };
}

class SearchQueryParams {
  @IsString()
  search: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  sort?: string;
}

class SearchResponse {
  @ValidateNested({ each: true })
  @Type(() => ProductType)
  data: ProductType[];

  @ValidateNested()
  @Type(() => Object)
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@JsonController('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  public async getAllProducts(
    @QueryParams() queryParams: FilterQueryParams<Product>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    const { data: products, meta } = await this.productService.filter({
      limit,
      page,
      sort,
      filter,
      populate: [
        { path: 'categoryId', Model: 'categories', type: 'single' },
        { path: 'shopId', Model: 'shops', type: 'single' },
      ],
      Model: ProductType,
    });

    if (products.length === 0) {
      return { message: 'No products found' };
    }
    return { data: products, meta };
  }

  @Get('/stats')
  @ResponseSchema(ProductStatsResponse)
  public async getProductsStats() {
    try {
      const stats = await this.productService.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            featured: [{ $match: { isFeatured: true } }, { $count: 'count' }],
            inStock: [{ $match: { stock: { $gt: 0 } } }, { $count: 'count' }],
            outOfStock: [{ $match: { stock: 0 } }, { $count: 'count' }],
          },
        },
      ]);

      return {
        data: {
          total: stats[0].total[0]?.count || 0,
          featured: stats[0].featured[0]?.count || 0,
          inStock: stats[0].inStock[0]?.count || 0,
          outOfStock: stats[0].outOfStock[0]?.count || 0,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch product stats');
    }
  }

  @Get('/search')
  @ResponseSchema(SearchResponse)
  public async searchProductsByLetter(
    @QueryParams() queryParams: SearchQueryParams,
  ) {
    const { search, limit = 10, page = 1, sort } = queryParams;

    if (!search || search.trim() === '') {
      return { message: 'Search query is required' };
    }

    const { data: products, meta } = await this.productService.filter({
      limit,
      page,
      sort,
      filter: `name::regex::^${search}`,
      populate: [
        { path: 'categoryId', Model: 'categories', type: 'single' },
        { path: 'shopId', Model: 'shops', type: 'single' },
      ],
      Model: ProductType,
    });

    if (products.length === 0) {
      return { message: 'No products found matching the search query' };
    }

    return { data: products, meta };
  }

  @Get('/:id')
  public async getProduct(@Param('id') id: Ref<Product>) {
    const product = await this.productService.findOneById(id, {
      populate: ['categoryId', 'shopId'],
      Model: ProductType,
    });
    if (!product) {
      return { message: 'Product not found' };
    }
    return { data: product };
  }

  @Get('/category/:id')
  // @Authorized(Object.values(Roles))
  @ResponseSchema(getAllProductsByShopResponse)
  public async getAllProductsByCategory(@Param('id') id: Ref<Category>) {
    const categoryProducts = await this.productService.find({
      filter: { categoryId: id },
      populate: ['categoryId', 'shopId'],
      Model: ProductType,
    });

    if (categoryProducts.length === 0) {
      return { message: 'No products found for this category' };
    }

    return { data: categoryProducts };
  }

  @Get('/shop/:id')
  // @Authorized(Object.values(Roles))
  @ResponseSchema(getAllProductsByShopResponse)
  public async getAllProductsByShop(@Param('id') id: Ref<Shop>) {
    const shopProducts = await this.productService.find({
      filter: { shopId: id },
      populate: ['categoryId', 'shopId'],
      Model: ProductType,
    });

    if (shopProducts.length === 0) {
      return { message: 'No products found for this shop' };
    }
    return { data: shopProducts };
  }

  @Post('/')
  @Authorized(Roles.ADMIN)
  public async createProduct(@Body() body: createProductBody) {
    const {
      name,
      description,
      categoryId,
      price,
      status,
      isFeatured,
      rating,
      currency,
      stock,
      shopId,
    } = body;
    const createdProductId = await this.productService.create({
      name,
      description,
      categoryId,
      status,
      isFeatured,
      rating,
      currency,
      price,
      stock,
      shopId,
    });

    const createdProduct = await this.productService.findOneById(
      createdProductId,
      {
        populate: ['categoryId', 'shopId'],
        Model: ProductType,
      },
    );

    return { message: 'Product created successfully', createdProduct };
  }

  @Post('/upload')
  @Authorized(Roles.ADMIN)
  public async uploadProducts(@Req() req) {
    const results = [];
    const errors = [];
    console.log('Uploaded File:', req.file);

    if (!req.file) {
      return { message: 'No file uploaded' };
    }

    if (req.file.size === 0) {
      return { message: 'Uploaded file is empty' };
    }

    console.log('File Path:', req.file.path);

    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            console.log('Parsed Row:', row);
            results.push(row);
          })
          .on('end', resolve)
          .on('error', reject);
      });

      // Process each row and create products
      for (const row of results) {
        try {
          const {
            name,
            description,
            price,
            stock,
            isFeatured,
            categoryId,
            status,
            rating,
            currency,
          } = row;

          // Validate required fields
          if (!name || !categoryId || !price) {
            errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
            continue;
          }

          // Validate numeric fields
          if (
            isNaN(Number(price)) ||
            isNaN(Number(stock)) ||
            (rating && isNaN(Number(rating)))
          ) {
            errors.push(
              `Invalid numeric values in row: ${JSON.stringify(row)}`,
            );
            continue;
          }

          // Validate currency only if provided
          if (currency && !Object.values(Currency).includes(currency)) {
            errors.push(
              `Invalid currency ${currency} in row: ${JSON.stringify(row)}`,
            );
            continue;
          }

          const isFeaturedBoolValue: boolean = isFeatured === 'True';

          await this.productService.create({
            name,
            description,
            categoryId,
            status: status || ProductStatus.INSTOCK,
            isFeatured: isFeaturedBoolValue,
            rating: rating ? Number(rating) : 0,
            currency: currency || Currency.RSD,
            price: Number(price),
            stock: Number(stock),
          });
        } catch (error: any) {
          errors.push(
            `Failed to create product from row: ${JSON.stringify(row)}. Error: ${error?.message || 'Unknown error'}`,
          );
        }
      }

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);

      if (errors.length > 0) {
        return {
          message: 'Some products failed to upload',
          successful: results.length - errors.length,
          failed: errors.length,
          errors,
        };
      }

      return {
        message: 'Products uploaded successfully',
        count: results.length,
        data: results,
      };
    } catch (error: any) {
      console.error('Error processing CSV file:', error);
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting temporary file:', unlinkError);
        }
      }
      return {
        message: 'Failed to process the file',
        error: error?.message || 'Unknown error',
      };
    }
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  public async updateProduct(
    @Param('id') id: Ref<Product>,
    @Body() product: Ref<Product>,
  ) {
    const {
      name,
      description,
      categoryId,
      isFeatured,
      rating,
      status,
      currency,
      price,
      stock,
    } = product;
    const existingProduct = await this.productService.findOneById(id);
    if (!existingProduct) {
      return { message: 'Product not found' };
    }
    await this.productService.updateOneById(id, {
      name,
      description,
      status,
      categoryId,
      currency,
      isFeatured,
      rating,
      price,
      stock,
      ...(stock > 0
        ? { status: ProductStatus.INSTOCK }
        : { status: ProductStatus.OUTOFSTOCK }),
    });

    const updatedProduct = await this.productService.findOneById(id, {
      populate: ['categoryId', 'shopId'],
      Model: ProductType,
    });

    return { data: updatedProduct, message: 'Product updated successfully' };
  }

  @Delete('/:id')
  @Authorized(Roles.ADMIN)
  public async deleteProduct(@Param('id') id: Ref<Product>) {
    await this.productService.delete(id);
    return {
      message: 'Product deleted successfully',
    };
  }
}
