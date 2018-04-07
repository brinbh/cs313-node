const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const pg = require('pg');
let connectionString = 'postgres://postgres:postgres@localhost:5432/stories';
const app = express();
require('./routes')(app);

app.set('port', (process.env.PORT || 5000));

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}))

if (process.env.PORT) {
  connectionString = process.env.DATABASE_URL;
}

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser());

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/login', urlencodedParser, function (req, res, next) {
  handleLogin(req, res);
});

app.post('/addStory', urlencodedParser, function (req, res, next) {
  console.log("posting addStory()");
  addStory(req, res);
  res.redirect('/');
});

app.get('/getStory/:id', function (req, res) {
  getStory(req, res);
});

app.get('/getAllStories', function(request, response) {
  getAllStories(request, response);
});

/*
* PORT Listening
*/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


/*
* Login
*/
function handleLogin(req, res) {
  var session = req.session;
  var credentials = {
    user: req.body.user,
    pass: req.body.pass
  }
  var result = {success: false};
  if (credentials.user === 'myUsername' && credentials.pass === "myPassword") {
    session.user = req.body.user;
    result = {success: true};
  }
  // res.redirect('/user');
  res.json(result);
  // return result;
}

/*
* Get all stories
*/
function getAllStories(request, response) {
  console.log("entering getAllStories()");
  // use a helper function to query the DB, and provide a callback for when it's done
  getAllStoriesFromDb( function(error, result) {

    // Make sure we got a row with the story, then prepare JSON to send back
    if (error || result == null) {
      console.log("Results: " + result);
      console.log("Error: " + error);
      response.status(500).json({success: false, data: error});
    } else {
      var stories = result;
      response.status(200).json(result);
    }
  });
}

/*
* get all stories from database
*/
function getAllStoriesFromDb(callback) {
  console.log("entering getAllStoriesFromDb()");
  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT story_id, story_title, story_content, story_author FROM stories ";

    var query = client.query(sql, function (err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      // call whatever function the person that called us wanted, giving it
      // the results that we have been compiling
      callback(null, result.rows);
    });
  });
}


/*
* Get story by id
*/
function getStory(request, response) {
  console.log("entering getStory()");
  // First get the person's id
  var id = request.params.id;

  // use a helper function to query the DB, and provide a callback for when it's done
  getStoryFromDb(id, function(error, result) {

    // Make sure we got a row with the person, then prepare JSON to send back
    if (error || result == null || result.length != 1) {
      response.status(500).json({success: false, data: error});
    } else {
      var story = result[0];
      response.status(200).json(result[0]);
    }
  });

  console.log("response: " + response);

  return response;
  // response.render('story');
}

/*
* Get one story from database
*/
function getStoryFromDb(id, callback) {
  console.log("Getting story from DB with id: " + id);

  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM stories WHERE story_id = $1::int";
    var params = [id];

    var query = client.query(sql, params, function (err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      callback(null, result.rows);
    });
  });
}

/*
* Add a Story
 */
function addStory(request, response) {
  console.log("entering addStory()");
  var story = {
    title: request.body.title,
    content: request.body.content,
    author: request.body.author
  }
  // use a helper function to query the DB, and provide a callback for when it's done
  addStoryToDb(story, function(error, result) {

    // Make sure we got a row with the person, then prepare JSON to send back
    if (error) {
      response.status(500).json({success: false, data: error});
    } else {
      response.status(200).json(result);
    }
  });

  return response;

}

/*
* Add Story to Database
*/
function addStoryToDb(story, callback) {
  console.log("entering addStoryToDb() ");

  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }
    var sql = 'INSERT INTO stories (story_title, story_content) VALUES ($1, $2)';
    var query = client.query("INSERT INTO stories (story_title, story_content, story_author) VALUES ($1, $2, $3)", [story.title, story.content, story.author], function (err, result) {
      console.log("entering client.query");
      // we are now done getting the data from the DB, disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ");
        console.log(err);
        callback(err, null);
      }
      var status;

      callback(null, status);
    });
    console.log("query: " + query);
  });
}