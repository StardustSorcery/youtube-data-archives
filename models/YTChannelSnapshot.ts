import { youtube_v3 } from '@googleapis/youtube';
import {
  ObjectId,
} from 'mongodb';

export default class YTChannelSnapshot {
  constructor(
    public timestamp: Date,
    public data: youtube_v3.Schema$Channel,
    public _id?: ObjectId,
  ) {}
}