import { Twitter } from 'twit';
import { Job } from './job';
import { TwitApiWrapper } from './tw_api_wrapper';

export class Context {
  before?: {
    status?: Twitter.Status;
    job?: Job;
  }
  status?: Twitter.Status;
  private tw: TwitApiWrapper;

  constructor(twManager: TwitApiWrapper) {
    this.tw = twManager;
  }

  //// condition
  public isMentionTo(userSrceenName: string): boolean {
    if (this.status.entities.user_mentions.length <= 0) return false;
    let match = this.status.entities.user_mentions.filter((user) => user.screen_name === userSrceenName);
    if (match.length < 1) return false;
    if (match.length >= 1) return true;
  }

  //// action
  public reply(message: string) {
    this.tw.reply(this.status, message);
  }
}