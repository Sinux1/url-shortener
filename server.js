// express library
const express = require('express')
// Setting up mongo
const mongoose = require('mongoose')
// Database model
const ShortUrl = require('./models/shortUrl')
// When you run the express function you get out a variable to use to set up entire app
const app = express()


mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})


// Set up views to use the ejs view engine
app.set('view engine', 'ejs')
// Tell app we are using url parameters - not why t or f
app.use(express.urlencoded({ extended: false}))

// Define a route for index
// It takes the index '/', and a function that takes req and 
// res variables passed in, and returns an index file from the 
// folder (views/index.ejs) (ejs is templating language)
app.get('/', async (req,res) => {
  //  When the index gets a get request, it displays the 
  // index file from the view directory
  const shortUrls = await ShortUrl.find()
  // Passing in the list of shorturls 
  res.render('index', { shortUrls: shortUrls })
})
// Defining route for a post request to /shortUrls
app.post('/shortUrls', async (req, res) => {
  // Need to connect to database
  // The req is from the form holding the input box, id is
  // fullUrl. So placing that into the full column of the schema.
  await ShortUrl.create({full: req.body.fullUrl})
  // The response is to redirect to index (does redirect send a get?)
  res.redirect('/')
}) 

// This must come below the rest. This colon syntax is saying 
// take any information that comes after the slash and 
// place it in a variable called shortUrl
app.get('/:shortUrl', async (req, res) => {
  // Return db object with short column equal to the shortUrl value from the url
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl}) 
  // If it doesn't exist send 404
  if(shortUrl == null) return res.sendStatus(404)
  // If it does exist increment it's clicks
  shortUrl.clicks++
  // To update shortUrl model
  shortUrl.save()
  // This is the redirection 
  res.redirect(shortUrl.full)

})

// using app now to set up 
// In package.json used config to set the port to 5000
app.listen(process.env.PORT || 5000)