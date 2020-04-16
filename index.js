'use strict'

const mysql = require('mysql');

require('dotenv').config()

const conn = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
})
// let products = [];
conn.connect(function(err){
    if(err){
        throw err;
    }
    //console.log('connected...')
    conn.query("SELECT * FROM product", function(err, result, fields){
        if(err){
            throw err;
        }
        //console.log(result)
        result.forEach(item => {
            products.push({
                name: item.product_name,
                price: item.product_price
            })
        })
    })
})

const Telegraf = require('telegraf')
const { Markup } = Telegraf

const app = new Telegraf(process.env.MY_BOT_TOKEN) 
const PAYMENT_TOKEN = process.env.MY_STRIPE_TOKEN

const products = []

function createInvoice (product) {
    return {
        provider_token: PAYMENT_TOKEN,
        start_parameter: 'foo',
        title: product.name,
        description: product.name,
        currency: 'IDR',
        is_flexible: false,
        need_shipping_address: false,
        prices: [{ label: product.name, amount: Math.trunc(product.price * 100) }],
        payload: {}
    }
}

app.command('start', ({ reply }) => reply('Selamat datang di toko kami !'))

// Show offer
app.hears(/^jual apa.*/i, ({ replyWithMarkdown }) => replyWithMarkdown(`
Apakah anda ingin melihat tawaran menarik kami? baiklah!
${products.reduce((acc, p) => {
    return (acc += `*${p.name}* - Rp. ${p.price} \n`)
    }, '')}    
mau beli yang mana?`,
    Markup.keyboard(products.map(p => p.name)).oneTime().resize().extra()
))

// Order product
products.forEach(p => {
    app.hears(p.product_name, (ctx) => {
        console.log(`${ctx.from.first_name} is about to buy a ${p.name}.`);
        ctx.replyWithInvoice(createInvoice(p));
    })
})

products.forEach(p => {
    app.hears(p.name, (ctx) => {
        console.log(`${ctx.from.first_name} is about to buy a ${p.name}.`);
        ctx.replyWithInvoice(createInvoice(p))
    })
})

// Handle payment callbacks
app.on('pre_checkout_query', ({ answerPreCheckoutQuery }) => answerPreCheckoutQuery(true))
app.on('successful_payment', (ctx) => {
    console.log(`${ctx.from.first_name} (${ctx.from.username}) just payed Rp. ${ctx.message.successful_payment.total_amount / 100}.`)
})

app.startPolling()
