import { youtube_v3 } from '@googleapis/youtube';
import {
  ObjectId,
} from 'mongodb';

export default class YTVideoSnapshot {
  constructor(
    public timestamp: Date,
    public data: youtube_v3.Schema$Video,
    public _id?: ObjectId,
  ) {}
}