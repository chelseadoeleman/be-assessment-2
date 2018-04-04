'use strict'

var data = [
  {
    id: '1',
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
    id: '2',
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
  .get('/nr1', match)
  //.get('/:id', all)
  // .post('/', add)
  // .get('/:id', get)
  // .put('/:id', set)
  // .patch('/:id', change)
  // .delete('/:id', remove)
  .listen(1902)

function all(request, response) {
  var result = {errors: [], data: db.all()}
  response.render('index.ejs', Object.assign({}, result, helpers))
}

function registrate(request, response) {
  var result = {errors: [], data: db.all()}
  response.render('registreren.ejs', Object.assign({}, result, helpers))
}

function registrateNext(request, response) {
  var result = {errors: [], data: db.all()}
  response.render('registreren1.ejs', Object.assign({}, result, helpers))
}

function makeBucketlist (request, response) {
  var result = {errors: [], data: db.all()}
  response.render('aanmakenBucketlist.ejs', Object.assign({}, result, helpers))
}

function location (request, response) {
  var result = {errors: [], data: db.all()}
  response.render('locatie.ejs', Object.assign({}, result, helpers))
}

function done (request, response) {
  var result = {errors: [], data: db.all()}
  response.render('voltooid.ejs', Object.assign({}, result, helpers))
}

function matches (request, response) {
  response.render('matches.ejs', {data: data})
  /*var result = {errors: [], data: db.all()}
  response.render('matches.ejs', Object.assign({}, result, helpers))*/
}

function match (request, response) {
  var result = {errors: [], data: db.all()}
  response.render('nr1.ejs', Object.assign({}, result, helpers))
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
