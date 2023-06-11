import {
  Collection,
} from 'mongodb';
import { TargetsByType } from '../types/targets';
import Target from '../models/Target';

exports.get = function get(collection: Collection): Promise<TargetsByType> {
  return collection.find().toArray().then(docs => {
    const targets = docs as Target[];

    const targetsByType: TargetsByType = {};

    targets.forEach(target => {
      const type = target.type;
      if(!targetsByType[type]) targetsByType[type] = [];
      targetsByType[type].push(target);
      return;
    });

    return targetsByType;
  });
};