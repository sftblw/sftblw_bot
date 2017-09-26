import * as Twit from 'twit';

import { Job } from "./Job"
import { TwitApiWrapper } from "./tw_api_wrapper"
import { Context } from './context'

interface BotConfig {
  ownerScreenName: string;
  botScreenName: string;
}

export default class Nest {
  public config: BotConfig;
  private twManager:TwitApiWrapper = null;

  constructor(key: Twit.Options, botConfig: BotConfig) {
    this.twManager = new TwitApiWrapper(key);
    this.config = botConfig

    // subscribe stream
    this.twManager.stream.on('tweet', (status) => {
      this.processStatus(status);
    });
  }

  private jobs:Job[] = [] as (Job[]);

  public addJob(job: Job) {
    this.jobs.push(job);
  }

  private processStatus(status: Twit.Twitter.Status) {
    let ctx = new Context(this.twManager);
    ctx.status = status;
    
    let jobsMatched = this.jobs.filter( (job) => { return job.condition(ctx)} );
    if (jobsMatched.length == 0) return;

    jobsMatched.forEach((job) => {
      job.action(ctx);
    });
  }
}