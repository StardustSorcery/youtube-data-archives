import {
  MongoClient,
  Db,
  Collection,
} from 'mongodb';

type MongoDB = {
  client: MongoClient;
  db: Db;
  collections: {
    targets: Collection,
    channels: Collection,
    videos: Collection,
  };
};