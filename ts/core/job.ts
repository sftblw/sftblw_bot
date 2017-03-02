import { Twitter } from 'twit';
import { Context } from './context';

export interface Job {
  init?: (any) => boolean;
  condition: (status: Context) => boolean;
  action: (ctx: Context) => boolean;
}