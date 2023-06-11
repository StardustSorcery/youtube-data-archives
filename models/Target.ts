import {
  ObjectId,
} from 'mongodb';

export default class Target {
  constructor(
    public provider: string,
    public type: string,
    public ids: {
      [key: string]: string,
    },
    public schedule: {
      tz: string,
      rule: string,
    },
    public _id?: ObjectId,
  ) {}
}