import {
  Collection,
} from 'mongodb';
import Target from '../models/Target';

exports.get = function get(collection: Collection) {
  return collection.find().toArray().then(docs => {
    return docs as Target[];
  });
};