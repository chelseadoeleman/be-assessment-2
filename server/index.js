'use strict'

console.log('restart server')

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
  .use(bodyParser.urlencoded({extended: true}))

  //GET
  .get('/', all)
  .get('/profile', profile)
  .get('/results', results)
  .get('/settings', settings)
  .get('/messages', messages)
  .get('/signUpForm', renderSignUpForm)

  //POST
  .post('/signUp', signUp)
  .post('/matches', matches)
  .get('/voltooid', finished)
  .get('/:id', match)
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
        response.redirect('/voltooid')
    }
  }
}

function finished (request, response) {
  response.render('voltooid.ejs')
}

function matches(request, response, next) {
  db.collection('match').find().toArray(done)

  function done(error, data) {
    if (error) {
      next(error)
    } else {
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
  response.render('profile.ejs')
}

function settings (request, response) {
  response.render('settings.ejs')
}

function results (request, response) {
  response.render('results.ejs')
}

function messages (request, response) {
  response.render('messages.ejs')
}
