const express = require('express')
const router = express.Router()

router.get('/', (req,res) =>{
    res.json({
        "Author": "Adhe Wahyu",
        "Github": "https://github.com/adhewahyu-dev",
        "Project": "Order-online"
    })
})

module.exports = router