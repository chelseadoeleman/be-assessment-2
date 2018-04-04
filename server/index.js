'use strict'

var data = [
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
]

var express = require('express')
var db = require('../db')
var helpers = require('./helpers')
var bodyParser = require ('body-parser')
var ejs = require ('ejs')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .use('/images', express.static('db/images'))
  .get('/', all)
  .post('/registreren', registrate)
  .post('/registreren1', registrateNext)
  .post('/aanmakenBucketlist', makeBucketlist)
  .post('/locatie', location)
  .post('/voltooid', done)
  .get('/matches', matches)
  .get('/:id', match)
  .get('/profile', profile)
  .get('/results', results)
  .get('/settings', settings)
  .get('/messages', messages)
  //.get('/:id', all)
  // .post('/', add)
  // .get('/:id', get)
  // .put('/:id', set)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .listen(1902)

function all(request, response) {
  response.render('index.ejs', {data: data})
}

function registrate(request, response) {
  response.render('registreren.ejs', {data: data})
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

function done (request, response) {
  response.render('voltooid.ejs', {data: data})
}

function matches (request, response) {
  response.render('matches.ejs', {data: data})
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

function match (request, response) {
  var id = request.params.id;
  response.render('detail.ejs', {data: data[id]})
}





/*function detail(request, response) {
  var id = request.params.id;

  if (db.has(id)) {
  var result = {errors: [], data: db.get(id)}
  response.render('detail.ejs', Object.assign({}, result, helpers))
  }

  /*else if (db.had(NaN)) {
    var error = {errors: [id: 400]}
  }*/

/*  else {
    var error = {errors: [{id: 404, title: 'Not found',},],}
    response.render('error.ejs', Object.assign({}, error, helpers))
    // response.statusCode = 404;
  }
}*/
