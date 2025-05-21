import mongoose from 'mongoose';

export const mongoId = (objectId: string | mongoose.Types.ObjectId) => {
  // Check if the objectId is already a valid ObjectId
  if (
    mongoose.Types.ObjectId.isValid(objectId) &&
    objectId instanceof mongoose.Types.ObjectId
  ) {
    return objectId;
  }

  // If it's not a valid ObjectId, create a new ObjectId from the hex string
  return mongoose.Types.ObjectId.createFromHexString(objectId as string);
};
