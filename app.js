const express = require('express')
const app = express()
const https = require('https')

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/resources/pages/index.html')
})

app.post('/', (req, res) => {
  const { unit, city, apiKey } = req.body
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
  let displayUnit = ''

  https.get(url, (response) => {
    response.on('data', data => {
      const weatherData = JSON.parse(data)
      const temp = weatherData.main.temp
      const description = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      if(unit === 'imperial') {
        displayUnit = 'degrees'
      } else {
        displayUnit = 'celsius'
      }
      res.set('Content-Type', 'text/html')
      res.write(`The weather in ${city} is ${description} and it is ${temp} ${displayUnit}.<br>`)
      res.write(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />`)
      res.send()
    })
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000.')
})