var express = require('express');
//var session = require('cookie-session'); // Session middleware.
var session = require('express-session'); // Session middleware.
var bodyParser = require('body-parser'); // Parameters middleware.

// Parse application/x-www-form-urlencoded.
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.set('trust proxy', 1) // trust first proxy 
// With express-session.
app.use(session({
  secret: 'todotopsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))
// With cookie-session.
// app.use(session({
//   secret: 'todotopsecret'
// }))

// Create an empty session, filled with empty tab.
.use(function(req, res, next){
	// Is todoList empty/undefined ?
    if (req.session.todolist === undefined) {
        req.session.todolist = [];
    }
    // Callback functon, to call .get(/todo).
    next();
})

// Get on todolist.
.get('/todo', function(req, res) { 
	// Load html with session elements.
    res.render('todo.ejs', {todolist: req.session.todolist});
})

// Post on todolist.
.post('/todo/add/', urlencodedParser, function(req, res) {
	// If request not empty ?
    if (req.body.newtodo != '') {
    	// Push it to the tab.
        req.session.todolist.push(req.body.newtodo);
    }
    // Redirect to the main page.
    res.redirect('/todo');
})

// Delete elements from list.
.get('/todo/delete/:id', function(req, res) {
	// If element id to delete is not empty ?
    if (req.params.id != '') {
    	// Delete element from the tab.
        req.session.todolist.splice(req.params.id, 1);
    }
    // Refirect to the main page.
    res.redirect('/todo');
})

// Default redirection.
.use(function(req, res, next){
    res.redirect('/todo');
})

// Start and listen server.
.listen(8080);