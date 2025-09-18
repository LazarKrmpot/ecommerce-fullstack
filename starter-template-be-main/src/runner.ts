// import { faker } from '@faker-js/faker';
// import {
//   ProductModel,
//   ProductStatus,
//   Currency,
// } from './api/models/product.model';
// import mongoose from 'mongoose';
export const runner = async () => {
  // // Run your functions here while in development
  // try {
  //   const categoryId = new mongoose.Types.ObjectId('680750f34093832587689a14');
  //   const products = Array.from({ length: 10000 }, () => ({
  //     name: faker.commerce.productName(),
  //     description: faker.commerce.productDescription(),
  //     categoryId,
  //     price: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
  //     status: faker.helpers.arrayElement([
  //       ProductStatus.INSTOCK,
  //       ProductStatus.OUTOFSTOCK,
  //     ]),
  //     isFeatured: faker.datatype.boolean(),
  //     rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  //     currency: faker.helpers.arrayElement(Object.values(Currency)),
  //     stock: faker.number.int({ min: 0, max: 500 }),
  //   }));
  //   await ProductModel.insertMany(products);
  //   console.log('✅ Inserted 10,000 products');
  // } catch (error) {
  //   console.error('❌ Error seeding products:', error);
  // } finally {
  //   await mongoose.disconnect(); // close after seeding
  // }
};
