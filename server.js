const express = require('express');
var router = express.Router();
const app = express();
const pg = require('pg');
const url = require('url');
const connectionString = 'postgres://postgres:postgres@localhost:5432/stories';

// var db_url = url.parse(DATABASE_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getStory', function(request, response) {
  getStory(request, response);
});

app.get('/getAllStories', function(request, response) {
  getAllStories(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*
GET A
 */
//
// function getAllAuthors(request, response) {
//   console.log("entering getAllStories()");
//
//   // use a helper function to query the DB, and provide a callback for when it's done
//   getAllStoriesFromDb( function(error, result) {
//
//     // Make sure we got a row with the story, then prepare JSON to send back
//     if (error || result == null) {
//       console.log("Results: " + result);
//       console.log("Error: " + error);
//       response.status(500).json({success: false, data: error});
//     } else {
//       var stories = result;
//       response.status(200).json(result);
//     }
//   });
// }
//
// function getAllStoriesFromDb(callback) {
//   console.log("Getting stories from DB");
//
//   var client = new pg.Client(connectionString);
//
//   client.connect(function (err) {
//     if (err) {
//       console.log("Error connecting to DB: ")
//       console.log(err);
//       callback(err, null);
//     }
//
//     var sql = "SELECT s.stories_title, s.stories_content, a.authors_name FROM stories as s INNER JOIN authors as a ON s.stories_id = a.authors_stories;";
//
//     var query = client.query(sql, function (err, result) {
//       // we are now done getting the data from the DB, disconnect the client
//       client.end(function (err) {
//         if (err) throw err;
//       });
//
//       if (err) {
//         console.log("Error in query: ")
//         console.log(err);
//         callback(err, null);
//       }
//
//       // console.log("Found result: " + JSON.stringify(result.rows));
//
//       // call whatever function the person that called us wanted, giving it
//       // the results that we have been compiling
//       callback(null, result.rows);
//     });
//   });
// }

/*
GET ALL STORIES
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

function getAllStoriesFromDb(callback) {
  console.log("Getting stories from DB");

  var client = new pg.Client(connectionString);

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
  // var id = request.query.id;
  var id = 2;
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
}

function getStoryFromDb(id, callback) {
  console.log("Getting story from DB with id: " + id);

  var client = new pg.Client(connectionString);

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
