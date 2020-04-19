require('dotenv').config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const axios = require("axios");
const API = process.env.URL
const Product = process.env.PRODUK
const bot = new TelegramBot(token, {polling:true})

let keranjang = [];
let total = 0;

const message = `Selamat Datang ! di toko kami
Kami adalah distributor pakaian muslim terlengkap di Indonesia.`
const Listbarang = '/product'
const Checkcart = '/keranjang'

    bot.onText(/\/start|\halo|\hi|\hy|\hai/, (msg) => {
    bot.sendMessage(msg.chat.id, `Halo ${msg.chat.last_name} ${message}`);
    bot.sendMessage(msg.chat.id, `Ketik ${Listbarang} untuk melihat product kami!`)
  });

  // Request List Produk
    bot.onText(/\/product/, msg => {
    let inline_keyboard = (item) => [
        [
            {
                text: "Tambah Ke Keranjang",
                callback_data: JSON.stringify(item.keranjang)
            }
        ]
    ]

    axios.get(API + Product)
        .then(response => { 
            const data = response.data.data
            data.forEach(item => { 
                let row = {
                    keranjang: {
                        id: item.id,
                        action: 'cart'
                    }
                        }
                bot.sendMessage(msg.chat.id,
                    `*Nama*: ${item.name}
                                                *Harga*: Rp. ${item.price}`,
                    {
                        reply_markup: {
                            inline_keyboard: inline_keyboard(row)
                        },
                        parse_mode: "Markdown"
                    }
                )
                    
            });
        }).catch(err => {
            console.log(err.message)
        })
})

bot.on("callback_query", function onCallbackQuery(callbackQuery){
    const action = JSON.parse(callbackQuery.data)
    const msg = callbackQuery.message
    let x = {
        keranjang: {
            id: action.id,
            action: 'cart'
    }
}
const opts1 = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
	reply_markup: {
		inline_keyboard: [[
			{
				text: "Tambah Ke Keranjang",
				callback_data: JSON.stringify(x.keranjang)
			}
		]]
	}
  };
  const opts2 = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;
	
	axios.get(API + Product + action.id)
		.then(response => {
				if (keranjang.length == 0) {
					keranjang.push({
						name: response.data.data.name,
						price: response.data.data.price,
						quantity: 1
					});
					text = `Product berhasil ditambahkan ke keranjang, 
Silahkan cek keranjang belanja anda ${Checkcart}`;
					bot.editMessageText(text, opts2);
				}
				else {
					let i = keranjang.findIndex(item => item.name == response.data.data.name);
					if (i != -1) {
						keranjang[i].quantity += 1;
                        text = `Product berhasil ditambahkan ke keranjang, 
Silahkan cek keranjang belanja anda ${Checkcart}`;
						bot.editMessageText(text, opts2);
					}
					else {
						keranjang.push({
							name: response.data.data.name,
							price: response.data.data.price,
							quantity: 1
						});
                        text = `Product berhasil ditambahkan ke keranjang, 
Silahkan cek keranjang belanja anda ${Checkcart}`;
						bot.editMessageText(text, opts2);
						
					}
				}
		})
		.catch(err => {
			console.log(err.message);
		});
});

// Check Cart
bot.onText(/\/keranjang/, msg => {
    let data = JSON.stringify(keranjang)
    for (let i = 0; i < keranjang.length; i++) {
        total+= keranjang[i].quantity * keranjang[i].price
    }
    bot.sendMessage(msg.chat.id, `Berikut Ini List Belanjaan kamu :  
*${data}* 
Total Belanja Kamu Sebesar Rp. *${total}*`, { parse_mode: "Markdown" }
    )
})