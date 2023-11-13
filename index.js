const express = require('express')
const PORT = 3000
const app = express()
const twig = require("twig")
const path = require("path")
const urls = require( './urls')


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'twig')

app.use(express.static('static'))
app.use(express.urlencoded({ extended: false}))
urls.setUrls(app)

app.set("twig options", {
    allowAsync: true,
    strict_variables: false
})

app.listen(PORT, ()=>{
    console.log('server stardet: localhost:3000')
})
