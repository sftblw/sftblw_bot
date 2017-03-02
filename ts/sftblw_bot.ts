import Nest from './core/nest';

let bot = new Nest(require("./config/sftblw_bot.json"), {
  botScreenName: "sftblw_bot",
  ownerScreenName: "sftblw"
});

bot.addJob({
  condition: (ctx) => {
    if (
       ctx.isMentionTo(bot.config.botScreenName)
    && ( ctx.status.text.search("멍멍") !== -1 )
    )
      return true;
    else return false;
  },
  action: (ctx) => {
    ctx.reply("왕왕");
    return true;
  }
})