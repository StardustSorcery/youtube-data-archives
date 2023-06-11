import { youtube_v3 } from "@googleapis/youtube";
import { Collection } from "mongodb";
import Target from '../models/Target';
import YTChannelSnapshot from "../models/YTChannelSnapshot";

exports.create = function create(ytClient: youtube_v3.Youtube, collection: Collection, targets: Target[]): Promise<YTChannelSnapshot[]> {
  function getSnapshots(targets: Target[], snapshots: YTChannelSnapshot[] = [], nextPageToken?: string): Promise<YTChannelSnapshot[]> {
    return  ytClient.channels.list({
      part: [
        'id',
        'snippet',
        'contentDetails',
        'statistics',
        'topicDetails',
        'status',
        'brandingSettings',
        //'auditDetails',
        'contentOwnerDetails',
        'localizations',
      ],
      id: targets.slice(0, 50).map(t => t.ids.channelId),
      maxResults: 50,
      pageToken: nextPageToken,
    }).then((resp) => {
      const now: Date = new Date();
      const result = resp.data;
      
      const _snapshots: YTChannelSnapshot[] = [
        ...snapshots,
        ...(result.items || []).map(channel => (
          new YTChannelSnapshot(
            now,
            channel,
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