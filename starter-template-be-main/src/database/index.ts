import path from 'path';

import { Seeder, SeederConfig } from 'mongo-seeding';

import { env } from 'env';

const config: SeederConfig = {
  database: env.db.uri,
  databaseReconnectTimeout: 1500,
  dropDatabase: true,
  dropCollections: true,
  removeAllDocuments: true,
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(
  path.resolve('./src/database/seeders'),
  {
    extensions: ['ts'],
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
);

seeder
  .import(collections)
  .then(() => {
    console.log('Seed complete!');
  })
  .catch((err) => {
    console.error('Error seeding database: ', err);
  });
