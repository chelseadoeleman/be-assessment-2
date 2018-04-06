'use strict'

var data
/* = [
  {
    id: 1,
    email: 'ddj@hotmail.com',
    password: '123',
    name: 'Daan de Jong',
    gender: 'Male',
    age: '26',
    location: 'Amsterdam',
    ampm: 'Avondmens',
    career: 'Commerciële economie HvA',
    work: 'ABN AMRO',
    bio: 'Koken, Concerten, Mexicaanses eten & Netflix',
    description: 'Astronomy, reading, coffee-shop people watching, playing make believe with my nephew, eating out on Monday nights, and staying inside on rainy days. Just a few of the thing that make me happy. Maybe you can help add to the list :) ',
    match: 'Women',
    minAge: '22',
    maxAge: '26',
    interests: 'Spontaan en goed gevoel voor humor',
    km: '40',
    b1: 'Skydiven',
    b2: 'Bali',
    b3: 'Nieuwe opleiding',
    b4: 'Kookcursus volgen',
    b5: 'Duiken'
  },
  {
    id: 2,
    email: 'nj@hotmail.com',
    password: '123',
    name: 'Noa Jansen',
    gender: 'Female',
    age: '28',
    location: 'Amsterdam',
    ampm: 'Avondmens',
    career: 'Commerciële economie HvA',
    work: 'ABN AMRO',
    bio: 'Koken, Concerten, Mexicaanses eten & Netflix',
    description: 'Astronomy, reading, coffee-shop people watching, playing make believe with my nephew, eating out on Monday nights, and staying inside on rainy days. Just a few of the thing that make me happy. Maybe you can help add to the list :) ',
    match: 'Men',
    minAge: '26',
    maxAge: '34',
    interests: 'Spontaan en goed gevoel voor humor',
    km: '40',
    b1: 'Skydiven',
    b2: 'Bali',
    b3: 'Nieuwe opleiding',
    b4: 'Kookcursus volgen',
    b5: 'Duiken',
    b6: 'Eten in een sterrenrestaurant'
  }
]*/

require('dotenv').config()
var session = require ('express-session')
var express = require('express')
var db = require('../db')
var helpers = require('./helpers')
var bodyParser = require ('body-parser')
var ejs = require ('ejs')
var mongo = require('mongodb')
var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
console.log(url)

module.exports = express()
  //SET
  .set('view engine', 'ejs')
  .set('views', 'view')

  //USE
  .use(express.static('static'))
  .use('/images', express.static('db/images'))

  //GET
  .get('/', all)
  .get('/:id', match)
  .get('/profile', profile)
  .get('/results', results)
  .get('/settings', settings)
  .get('/messages', messages)

  //POST
  .post('/registreren', registrate)
  .post('/registreren1', registrateNext)
  .post('/aanmakenBucketlist', makeBucketlist)
  .post('/locatie', location)
  .post('/voltooid', finished)
  .post('/matches', matches)
  //.get('/:id', all)
  //.post('/', add)
  // .get('/:id', get)
  // .put('/:id', set)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .listen(1902)


mongo.MongoClient.connect(url, function (error, client) {
    if (error) throw error
    db = client.db(process.env.DB_NAME)
})

function all(request, response) {
  response.render('index.ejs', {data: data})
}

function registrate(request, response, next) {
  response.render('registreren.ejs', {data: data})
  db.collection('match').insertOne({
    email: request.body.email,
    password:request.body.password,
    name: request.body.name,
    gender:request.body.gender,
    age:request.body.age,
    location:request.body.location,
    ampm:request.body.ampm,
    career:request.body.career,
    work:request.body.work,
    bio:request.body.bio,
    description:request.body.description
  }, done)
  function done(error, data) {
    if (error) {
      next(error)
    } else {
      response.redirect('/registreren1' + data.insertedId)
    }
  }
}

function registrateNext(request, response) {
  response.render('registreren1.ejs', {data: data})
}

function makeBucketlist (request, response) {
  response.render('aanmakenBucketlist.ejs', {data: data})
}

function location (request, response) {
  response.render('locatie.ejs', {data: data})
}

function finished (request, response) {
  response.render('voltooid.ejs', {data: data})
}

function matches(request, response, next) {
  db.collection('match').find().toArray(done)

  function done(error, data) {
    if (error) {
      next(error)
    } else {
      console.log(data)
      response.render('matches.ejs', {data: data})
    }
  }
}

function match(request, response, next) {
  var id = request.params.id
  db.collection('match').findOne({
    _id: mongo.ObjectID(id)
  }, done)

  function done(error, data) {
    if (error) {
      next(error)
    } else {
      response.render('detail.ejs', {data: data})
    }
  }
}

function profile (request, response) {
  response.render('profile.ejs', {data: data})
}

function settings (request, response) {
  response.render('settings.ejs', {data: data})
}

function results (request, response) {
  response.render('results.ejs', {data: data})
}

function messages (request, response) {
  response.render('messages.ejs', {data: data})
}

/*
    match:request.body.match,
    minAge:request.body.minAge,
    maxAge:request.body.maxAge,
    interests:request.body.interests,
    km:request.body.km,
    bucketlist:request.body.bucketlist
  }, done)

  function done(error, data) {
    if (error) {
      next(error)
    } else {
      response.redirect('/' + data.insertedId)
    }
  }
}
/*function matches (request, response) {
  response.render('matches.ejs', {data: data})
}*/

/*
  //Handle data in array from server
  function match (request, response) {
  var id = request.params.id;

  //Maikel van Veen
  if (isNaN(id)) {
    // Handle een error als een id geen nummer is.
    console.log('400')
  } else {
    var matchFound = false

    if (data.filter(match => match.id == id)) {
      matchFound = true
    }

    if (matchFound) {
      data.forEach(match => {
        if (match.id == id) {
          response.render('detail.ejs', {data: match})
        }
      })
    } else {
      console.log('404')
      // Handle een error als er geen match met de opgegeven id is gevonden.
    }
  }
  /*function match (request, response) {
    var id = request.params.id;
    response.render('detail.ejs', {data: data[id]})
    console.log("id")
  }
}*/
