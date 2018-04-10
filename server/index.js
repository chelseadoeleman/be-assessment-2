'use strict'

// Check if the server has restarted
console.log('restart server')

require('dotenv').config()
var argon2 = require('argon2')
var session = require('express-session')
var express = require('express')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var mongo = require('mongodb')
var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
console.log(url)

module.exports = express()
  // SET
  .set('view engine', 'ejs')
  .set('views', 'view')

  // USE
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .use(express.static('static'))
  .use('/images', express.static('db/images'))
  .use(bodyParser.urlencoded({extended: true}))

  // GET
  .get('/', all)
  .get('/logOut', logOut)
  .get('/signUpSuccess', finished)
  .get('/profile', profile)
  .get('/results', results)
  .get('/settings', settings)
  .get('/matches', matches)
  .get('/messages', messages)
  .get('/signUpForm', signUpForm)
  .get('/:id', match)
  .get('/remove',remove)

  // POST
  .post('/login', login)
  .post('/signUp', signUp)

  // Error handlers
  .use(notFound)
  .use(httpErrors)

  .listen(1902)

// Connect with mongodb database 'match'
mongo.MongoClient.connect(url, function (error, client) {
    if (error) throw error
    // searches for 'match'
    db = client.db(process.env.DB_NAME)
})

// Shows the homepage
function all(request, response) {
  // When an error occurs, all the information from that error will be stored in a string
  if (request.session.error) {
    response.render('index.ejs', {error: request.session.error.title})
    // Data error will be shown in the homepage
  } else {
    // When there is no error the homepage will be rendered. Data error is null
    response.render('index.ejs', {error: null})
  }
}

// User data will be checked in the database. When succesfull the user can log in.
function login(request, response, next) {
  // Email will be set to lowercase
  var email = request.body.email.toLowerCase()
  var password = request.body.password

  // When email or password don't have any input show error
  if (!email || !password) {
    response.status(400).send('Email or password are missing')

    return
  }

  // Check if the given email exists in the database
  db.collection('match').findOne({email: email}, done)

  function done (error, data) {
    var user = data

    // When an error occurs, go to Error handlers
    if (error) {
      next(error)
    } else if (user) { // Data of email has a match in database and a password is given by the user
      argon2.verify(user.password, password).then(onVerify, next) // Proceed to function onVerify
    } else {
      // No match in database
      response.status(401).send('Email does not exist')
    }

    // Hashed password and email are correct
    function onVerify (match) {
      // Show page with matches of the user if password and email are a match
      if (match) {
        // Save name and id of the user, during session in a string.
        // First letter of name will be Capital
        var username = user.name.charAt(0).toUpperCase() + user.name.slice(1)
        request.session.user = {username: username, _id: user._id}
        response.redirect('/matches')
      } else {
        // Password not found in database
        response.status(401).send('Password incorrect')
      }
    }
  }
}

// Destroy a session of the user
function logOut(request, response, next) {
  // All data which was stored in a string will be destroyed
  request.session.destroy(function (error){
    // When an error occurs go to Error handlers
    if (error) {
      next(error)
    // Destroying session was succesfull, go to the homepage
    } else {
      response.redirect('/')
    }
  })
}

// Show form for the user to register
function signUpForm(request, response) {
  response.render('registreren.ejs')
}

// Save all the input of SignUpForm in database
function signUp(request, response, next) {
  var email = request.body.email
  var password = request.body.password

  // Email and password are required if the user wants to login in the future
  if (!email || !password) {
    //No input of email or password
    response.status(400).send('Email or password are missing')

    return
  }

  // Check if the email already exists in the database
  db.collection('match').findOne({email: email}, findDuplicateEmail)

  function findDuplicateEmail(error, data) {
    // When an error occurs go to Error handlers
    if (error) {
      next(error)
    // When there is an already existing email send error
    } else if (data) {
      response.status(400).send('Existing email')
    // Email doesn't exist in database
    } else {
      // Hash password and go to funciton onhash
      argon2.hash(password).then(onhash, next)

      // Send data from form to database
      function onhash(hash) {
        db.collection('match').insertOne({
          email: request.body.email,
          password: hash, // password is hashed before it will be stored in the database
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
        }, done) //When data is succesfully inserted in the databse proceed to function done

        function done(error, data) {
          // Error occurs go to Error handlers
          if (error) {
            next(error)
          } else {
            // Store name, where the first letter will be in Capital and id in a string to show name in 'voltooid'
            var username = request.body.name.charAt(0).toUpperCase() + request.body.name.slice(1)
            request.session.user = {username: username, _id: data.insertedId}
            // Go to function finished to show that the sign up was succesfull
            response.redirect('/signUpSuccess')
          }
        }
      }
    }
  }
}

// Sign up succesfull
function finished(request, response) {
  // Check if the user is logged in
  if (request.session.user) {
    //Show name of user in 'voltooid.ejs'
    response.render('voltooid.ejs', {data: {name: request.session.user.username}})
  } else {
    // User is not logged in, so can't show the 'voltooid.ejs' page
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// Show a list of matches in the database
function matches(request, response, next) {
  // Check if the user is logged in, then proceed to function done
  if (request.session.user) {
    db.collection('match').find().toArray(done)

    function done(error, data) {
      // Error occurs go to Error handlers
      if (error) {
        next(error)
      } else {
        // Show list of users (matches) from the database
        response.render('matches.ejs', {data: data})
      }
    }
  } else {
    // User is not logged in, so can't show matches
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// Show detail page of a user from the database
function match(request, response, next) {
  // Check if the user is logged in, then proceed to function done
  if (request.session.user) {
    var id = request.params.id

    // Look for the requested id of the user-detail page in the database
    db.collection('match').findOne({
      _id: mongo.ObjectID(id)
    }, done)

    function done(error, data) {
      // Error occurs go to Error handlers
      if (error) {
        next(error)
      // When user id is found in the database show detail page. Send data from the user with the userID.
      } else if (data) {
        response.render('detail.ejs', {data: data})
      } else {
        // Show error from customError via Error handlers
        // response.status(401).send('Credentials required')
        var customError = new Error('Creditentials required')
        next(customError)
      }
    }
  } else {
    // User is not logged in, so can't show match
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// Show profile of the user
function profile(request, response) {
  // Check if the user is logged in
  if (request.session.user) {
    response.render('profile.ejs')
  } else {
    // User is not logged in, show error
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// Remove user profile
function remove(request, response, next) {
  var id = request.params.id

  db.collection('match').deleteOne({_id: mongo.ObjectID(id)
  }, done)

  function done(error) {
    if (error) {
      next(error)
    } else {
      console.log('removed')
      response.json({status: 'ok'})
    }
  }
}

// Let user change the settings
function settings(request, response) {
  // Check if the user is logged in
  if (request.session.user) {
    response.render('settings.ejs')
  } else {
    // User is not logged in, show error
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// User can see their test results
function results(request, response) {
  // Check if the user is logged in
  if (request.session.user) {
    response.render('results.ejs')
  } else {
    // User is not logged in, show error
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// User can respond to messages from matches
function messages(request, response) {
  if (request.session.user) {
    // Check if the user is logged in
    response.render('messages.ejs')
  } else {
    // User is not logged in, show error
    request.session.error = {title: 'Creditentials required'}
    var customError = new Error('Creditentials required')
    next(customError)
    response.status(401).send('Credentials required')
  }
}

// When an error occurs in a function, proceed to function notFound
function notFound(error, request, response, next) {
  if (error) {
    console.error(error)
    console.log('Hier komen errors terecht van next(error)')
    response.redirect('/')
  } else {
    // Proceed tot httpErrors
    next()
  }
}

// Page not found respond with 404
function httpErrors(request, response, next) {
  console.log('Niet bestaande route, render 404 pagina')
  response.redirect('/')
}
