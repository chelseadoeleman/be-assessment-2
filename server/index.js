'use strict'

console.log('restart server')

require('dotenv').config()
var session = require ('express-session')
var express = require('express')
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
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .use(express.static('static'))
  .use('/images', express.static('db/images'))
  .use(bodyParser.urlencoded({extended: true}))

  //GET
  .get('/', all)
  .get('/signUpSuccess', finished)
  .get('/profile', profile)
  .get('/results', results)
  .get('/settings', settings)
  .get('/messages', messages)
  .get('/signUpForm', renderSignUpForm)
  .get('/:id', match)

  //POST
  .post('/signUp', signUp)
  .post('/matches', matches)
  .listen(1902)


mongo.MongoClient.connect(url, function (error, client) {
    if (error) throw error

    db = client.db(process.env.DB_NAME)
})

function all(request, response) {
  response.render('index.ejs')
}

function renderSignUpForm (request, response) {
  response.render('registreren.ejs')
}

function signUp(request, response, next) {
  db.collection('match').insertOne({
    email: request.body.email,
    password: request.body.password,
    name: request.body.name,
    gender: request.body.gender,
    age: request.body.age,
    location: request.body.location,
    ampm: request.body.ampm,
    career: request.body.career,
    work: request.body.work,
    bio: request.body.bio,
    description: request.body.description,
    match: request.body.match,
    minAge: request.body.minAge,
    maxAge: request.body.maxAge,
    interests: request.body.interests,
    km: request.body.km
    // bucketlist:request.body.bucketlist
  }, done)

  function done(error, data) {
    if (error) {
      next(error)
    } else {
      var username = request.body.name.charAt(0).toUpperCase() + request.body.name.slice(1)
      request.session.user = {username: username, _id: data.insertedId}
      response.redirect('/signUpSuccess')
    }
  }
}

function finished (request, response) {
  if (request.session.user) {
    response.render('voltooid.ejs')
  } else {
    response.status(401).send('Credentials required')
  }
}

function matches(request, response, next) {
  if (request.session.user) {
    db.collection('match').find().toArray(done)

    function done(error, data) {
      if (error) {
        next(error)
      } else {
        response.render('matches.ejs', {data: data})
      }
    }
  } else {
    response.status(401).send('Credentials required')
  }
}


function match(request, response, next) {
  if (request.session.user) {
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
  } else {
    response.status(401).send('Credentials required')
  }
}

function profile (request, response) {
  if (request.session.user) {
    response.render('profile.ejs')
  } else {
    response.status(401).send('Credentials required')
  }
}

function settings (request, response) {
  if (request.session.user) {
    response.render('settings.ejs')
  } else {
    response.status(401).send('Credentials required')
  }
}

function results (request, response) {
  if (request.session.user) {
    response.render('results.ejs')
  } else {
    response.status(401).send('Credentials required')
  }
}

function messages (request, response) {
  if (request.session.user) {
    response.render('messages.ejs')
  } else {
    response.status(401).send('Credentials required')
  }
}
