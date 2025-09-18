import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import {
  ProductModel,
  ProductStatus,
  Currency,
} from './api/models/product.model';

async function seedProducts() {
  try {
    // ✅ Connect to your MongoDB
    await mongoose.connect('mongodb://localhost:27017/testdb');

    console.log('Connected to MongoDB');

    const categoryId = new mongoose.Types.ObjectId('680750f34093832587689a14');

    // ✅ Generate 10,000 products
    const products = Array.from({ length: 10000 }, (_, i) => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      categoryId,
      price: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })), // in RSD
      status: faker.helpers.arrayElement([
        ProductStatus.INSTOCK,
        ProductStatus.OUTOFSTOCK,
      ]),
      isFeatured: faker.datatype.boolean(),
      rating: Math.round(faker.number.float({ min: 0, max: 5 }) * 10) / 10,
      currency: Currency.RSD, // fixed to RSD, change if needed
      stock: faker.number.int({ min: 0, max: 500 }),
      shopId: null, // keep null or add valid Shop IDs if needed
    }));

    // ✅ Insert in bulk
    await ProductModel.insertMany(products);

    console.log('✅ Successfully inserted 10,000 products');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
