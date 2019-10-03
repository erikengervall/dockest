'use strict'

const bodyParser = require('body-parser')
const app = require('express')()
const fetch = require('node-fetch')

app.use(bodyParser.text())

app.post('/', (req, res) => {
  const url = req.body

  res.status(200).send('OK.')

  setTimeout(() => {
    fetch(url)
  }, 2000)
})

app.listen(9000)
