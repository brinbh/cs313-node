const express = require('express');
var router = express.Router();
const app = express();
const pg = require('pg');
const url = require('url');
const connectionString = 'postgres://postgres:postgres@localhost:5432/stories';

app.set('port', (process.env.PORT || 5000));
console.log("entering index.js");

if (process.env.PORT) {
  var db_url = url.parse('postgres://xxhxbtldlnxyez:2b9e3d43cb295598843f53e36c72ce158389bc5109a746509dd4e1a6dee32ee0@ec2-54-221-212-15.compute-1.amazonaws.com:5432/d2uc0f94loimtc');
  // var scheme = db_url.protocol.substr(0, db_url.protocol.length - 1);
  var user = db_url.auth.substr(0, db_url.auth.indexOf(':'));
  var pass = db_url.auth.substr(db_url.auth.indexOf(':') + 1, db_url.auth.length);
  var host = db_url.host.substr(0, db_url.host.indexOf(':'));
  var port = db_url.host.substr(db_url.host.indexOf(':') + 1, db_url.host.length);
  var db = db_url.path.substr(db_url.path.indexOf('/') + 1, db_url.path.length);

  const client = new Client({
    host: host,
    user: user,
    database: db,
    password: pass,
    port: port
  });

  console.log('host: ' + client.host + ' user: ' + client.user + ' password: ' + client.password );

}

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// routing to different pages

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/story/:id', function (req, res) {
  var story = getStory(req, res);
  console.log("rendering story: " + story);
  res.render('story', {story: story});
});

// access points
// app.get('/getStory', function(request, response) {
//   getStory(request, response);
// });

app.get('/getAllStories', function(request, response) {
  getAllStories(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


/*
GET ALL STORIES
 */

function getAllStories(request, response) {

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

function getAllStoriesFromDb(callback) {

  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT s.stories_id, s.stories_title, s.stories_content, a.authors_name FROM stories as s INNER JOIN authors as a ON s.stories_id = a.authors_stories";

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

      // console.log("Found result: " + JSON.stringify(result.rows));

      // call whatever function the person that called us wanted, giving it
      // the results that we have been compiling
      callback(null, result.rows);
    });
  });
}


/*
GET STORY BY ID
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

function getStoryFromDb(id, callback) {
  console.log("Getting story from DB with id: " + id);

  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM stories WHERE stories_id = $1::int";
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

      // console.log("Found result: " + JSON.stringify(result.rows));

      // call whatever function the person that called us wanted, giving it
      // the results that we have been compiling
      callback(null, result.rows);
    });
  });
}
