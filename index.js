const TelegramBot = require('node-telegram-bot-api')
const token = '1182971999:AAH-KpFPN4YVNMd14bYqaN8UR7CyuozqUOU'

const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/salam/, (msg) => {
    bot.sendMessage(msg.chat.id, "Assalamualaikum", {
        reply_to_message_id: msg.message_id,
    })
})

