# YouTube Data Archives

Retrieves specific YouTube channels / videos data and stores them in a database.

## Requirements

- MongoDB
- Docker Engine *or* Node.js development environment with `npm`

You can pull built docker image from GitHub Container Registry.

https://github.com/StardustSorcery/strapi/pkgs/container/youtube-data-archives

## Environment Variables
### MongoDB
#### `MONGO_URI`
Default: "mongodb://mongo/youtube-data-archives"

Specifies MongoDB connection settings. You can include database name in the URI as default database.

Reference: https://www.mongodb.com/docs/manual/reference/connection-string/

#### `MONGO_DATABASE`
Default: "" (empty)

Specifies MongoDB database name to read / write with this tool. If both `MONGO_DATABASE` and default database in `MONGO_URI`, `MONGO_DATABASE` overwrites database name.

#### `MONGO_TARGETS_COLLECTION`
Default: "targets"

Specifies MongoDB collection name which has document(s) of target information.

#### `MONGO_CHANNELS_COLLECTION`
Default: "channels"

Specifies MongoDB collection name which this tool should insert documents of YouTube channels archives.

#### `MONGO_VIDEOS_COLLECTION`
Default: "videos"

Specifies MongoDB collection name which this tool should insert documents of YouTube videos archives.

### YouTube API
#### `GOOGLE_AUTH_METHOD`
Default: "API-KEY"

Specifies which method should be used to authenticate when this tool calls YouTube API.

Acceptable value is "API-KEY" only.

#### `GOOGLE_API_KEY`
Default: "" (empty)

Specifies Google Cloud Platform API key. Required when `GOOGLE_AUTH_METHOD` is set to "API_KEY".

You need to generate it on [GCP Console](https://console.cloud.google.com/) with YouTube Data API v3 access.

### Tool's Behavior
#### `CRON_RULE`

Specifies when this tool create archives of targets. Timezone follows machine (docker container)'s timezone.

```text
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

## Schemas
### Target (YouTube Channel)
```jsonc
{
  "_id": ObjectId("6485f22840acd187c8d61be3"), // MongoDB ObjectId
  "provider": "www.youtube.com",
  "type": "channel",
  "ids": {
    "channelId": "UCSzT-rU62SSiham-g1Dj9yw"
  }
}
```

### Target (YouTube Video)
```jsonc
{
  "_id": ObjectId("6485f22840acd187c8d61be3"), // MongoDB ObjectId
  "provider": "www.youtube.com",
  "type": "video",
  "ids": {
    "videoId": "36D0KRaqgok"
  }
}
```

### YouTube Channel Snapshot
```jsonc
{
  "_id": ObjectId("6485e65cefec87b4cc583f87"), // MongoDB ObjectId
  "timestamp": "2023-06-11T15:21:00.356+00:00", // Date
  "data": { ... } // youtube#channel
}
```

### YouTube Video Snapshot
```jsonc
{
  "_id": ObjectId("6485e65cefec87b4cc583f87"), // MongoDB ObjectId
  "timestamp": "2023-06-11T15:21:00.356+00:00", // Date
  "data": { ... } // youtube#video
}
```