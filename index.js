'use strict'

const Telegraf = require('telegraf')
const { Markup } = Telegraf

require('dotenv').config()

const app = new Telegraf(process.env.MY_BOT_TOKEN) 
const PAYMENT_TOKEN = process.env.MY_STRIPE_TOKEN

const products = [
    {
        name: 'Teh Botol Sosro',
        price: 16000,
        description: 'Tehbotol Sosro kemasan botol beling atau sering disebut RGB ( Returnable Glass Bottle) merupakan produk Teh siap minum yang pertama di Indonesia dan di Dunia yang sudah diluncurkan sejak tahun 1969!'
    },
    {
        name: 'Teh Freshtea',
        price: 19000,
        description: 'Frestea diproduksi dengan menggunakan standar kualitas tinggi The Coca-Cola Company, menggunakan teknologi tinggi dan didukung oleh proses produksi higienis.'
    },
    {
        name: 'Teh Kotak',
        price: 21000,
        description: 'Teh Kotak adalah minuman teh yang terbuat dari pucuk daun teh berkualitas tinggi, teh ini mengandung mineral dan vitamin yang baik bagi tubuh.'
    }
]

function createInvoice (product) {
    return {
        provider_token: PAYMENT_TOKEN,
        start_parameter: 'foo',
        title: product.name,
        description: product.description,
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