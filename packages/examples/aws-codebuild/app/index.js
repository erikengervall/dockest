'use strict'

const bodyParser = require('body-parser') // eslint-disable-line @typescript-eslint/no-var-requires
const app = require('express')() // eslint-disable-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch') // eslint-disable-line @typescript-eslint/no-var-requires

app.use(bodyParser.text())

app.post('/', (req, res) => {
  const url = req.body

  res.status(200).send('OK.')

  setTimeout(() => {
    fetch(url)
  }, 2000)
})

app.listen(9000)
