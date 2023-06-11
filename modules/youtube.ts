import assert from 'node:assert';
import {
  youtube,
  youtube_v3,
} from '@googleapis/youtube';
import { Youtube } from '../types/youtube';

exports.init = function init(): Youtube {
  const {
    GOOGLE_AUTH_METHOD,
    GOOGLE_API_KEY,
  } = process.env;

  let auth: string;
  switch(GOOGLE_AUTH_METHOD) {
    default: {

    }
    case 'API-KEY': {
      assert(GOOGLE_API_KEY);
      auth = GOOGLE_API_KEY;
    }
  }

  const client: youtube_v3.Youtube = youtube({
    version: 'v3',
    auth,
  });

  return {
    client,
  };
};