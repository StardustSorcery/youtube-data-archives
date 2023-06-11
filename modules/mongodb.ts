import assert from 'node:assert';
import {
  MongoClient,
} from 'mongodb';
import { MongoDB } from '../types/mongodb';

exports.init = function init(): MongoDB {
  const {
    MONGO_URI,
    MONGO_DATABASE,
    MONGO_TARGETS_COLLECTION,
    MONGO_CHANNELS_COLLECTION,
  } = process.env;

  assert(MONGO_URI);
  const client = new MongoClient(MONGO_URI);

  const db = client.db(
    (!MONGO_DATABASE || MONGO_DATABASE === '') ? undefined : MONGO_DATABASE
  );

  assert(MONGO_TARGETS_COLLECTION);
  assert(MONGO_CHANNELS_COLLECTION);
  return {
    client,
    db,
    collections: {
      targets: db.collection(MONGO_TARGETS_COLLECTION),
      channels: db.collection(MONGO_CHANNELS_COLLECTION),
    },
  };
};