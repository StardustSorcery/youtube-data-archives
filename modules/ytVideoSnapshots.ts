import { youtube_v3 } from "@googleapis/youtube";
import { Collection } from "mongodb";
import Target from '../models/Target';
import YTVideoSnapshot from "../models/YTVideoSnapshot";

exports.create = function create(ytClient: youtube_v3.Youtube, collection: Collection, targets: Target[]): Promise<YTVideoSnapshot[]> {
  function getSnapshots(targets: Target[], snapshots: YTVideoSnapshot[] = [], nextPageToken?: string): Promise<YTVideoSnapshot[]> {
    return  ytClient.videos.list({
      part: [
        'id',
        'snippet',
        'contentDetails',
        'status',
        'statistics',
        'player',
        'topicDetails',
        'recordingDetails',
        //'fileDetails',
        //'processingDetails',
        //'suggestions',
        'liveStreamingDetails',
        'localizations',
      ],
      id: targets.slice(0, 50).map(t => t.ids.videoId),
      maxResults: 50,
      pageToken: nextPageToken,
    }).then((resp) => {
      const now: Date = new Date();
      const result = resp.data;
      
      const _snapshots: YTVideoSnapshot[] = [
        ...snapshots,
        ...(result.items || []).map(video => (
          new YTVideoSnapshot(
            now,
            video,
          )
        )),
      ]

      if(!result.nextPageToken) return _snapshots;
      return getSnapshots(targets.slice(50), _snapshots, result.nextPageToken);
    });
  }

  return getSnapshots(targets).then((snapshots) => {
    return collection.insertMany(snapshots).then(() => {
      return snapshots;
    });
  });
}