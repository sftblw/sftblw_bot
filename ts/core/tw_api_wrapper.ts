import * as Twit from 'twit';

export class TwitApiWrapper {
  private tw: Twit;
  public stream: NodeJS.ReadableStream;

  constructor(key: Twit.Options) {
    this.tw = new Twit(key);
    this.stream = this.tw.stream('user', {});
  }

  public reply(status: Twit.Twitter.Status, message: string) {
      // + status.entities.user_mentions.map((user) => '@' + user.screen_name).join(' ');

    this.tw.post('statuses/update', {
      status: `@${status.user.screen_name} ${message}`,
      in_reply_to_status_id: status.user.id_str
    });
    .catch((reason) => {throw reason});
  }
}