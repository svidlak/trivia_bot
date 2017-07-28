const TeleBot = require('telebot');
const bot = new TeleBot('418306020:AAEkg_qPTJ4_FQUjioaTWSlSdAlmZdeqGdE');
const request = require('request-promise');

let reset = true;
let correct = '';
let incorrect = [];
bot.on("*", msg => {
    if(msg.text == correct){
        msg.reply.text(`@${msg.from.first_name} won the round, please wait for the next question`);
        bot.event('/start', msg);
    } else {
        //msg.reply.text(`${msg.from.username} wrong answer`);
       // console.log(msg)
    }
})  

bot.on('/start', (msg) => {
    let question = 'test';

    request('https://opentdb.com/api.php?amount=1').then( resp => {
        let body = JSON.parse(resp);
        question = body.results[0].question;
        correct = body.results[0].correct_answer;
        let incorrect_answers = body.results[0].incorrect_answers;
        incorrect = incorrect_answers;
        let buttons_array = [bot.button("true", correct), bot.button(incorrect[0], incorrect[0]), bot.button(incorrect[1], incorrect[1]), bot.button(incorrect[2], incorrect[2])]
        buttons_array.sort(() => Math.random() * 2 - 1);
        let replyMarkup = bot.keyboard([buttons_array], {resize: true});
        return bot.sendMessage(msg.chat.id, question, {replyMarkup});
    }).catch( err => {
        bot.event('/start', msg);
    })
});


bot.start();