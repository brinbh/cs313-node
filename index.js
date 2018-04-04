const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const pg = require('pg');
const url = require('url');
let connectionString = 'postgres://postgres:postgres@localhost:5432/stories';
const app = express();
const { Client } = require('pg');

app.set('port', (process.env.PORT || 5000));
console.log("PORT: " + process.env.PORT);
console.log("entering index.js");

if (process.env.PORT) {
  connectionString = process.env.DATABASE_URL;
}

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser());

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/login', function (req, res) {
  username: req.body.username;
  password:  req.body.password;
  console.log(username + " " + password);
})

app.get('/logout', function (req, res) {
})

// routing to different pages

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/add', function (req, res) {
  res.render('add')
});

app.post('/addStory', urlencodedParser, function (req, res) {
  console.log("posting addStory()");
  addStory(req, res);
  // res.render('success', {data: req.body});
  // res.end(JSON.stringify(req.body))
});

app.get('/getStory/:id', function (req, res) {
  getStory(req, res);
});

app.get('/story/:id', function (req, res) {
  res.render('story');
});

app.get('/getAllStories', function(request, response) {
  getAllStories(request, response);
});

/* PORT Listening */

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

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
  console.log("entering getAllStoriesFromDb()");
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

      callback(null, result.rows);
    });
  });
}

function addStory(request, response) {
  console.log("entering addStory()");
  var author = request.body.author;
  var story = {
    title: request.body.title,
    content: request.body.content
  }
  // use a helper function to query the DB, and provide a callback for when it's done
  // addStoryToDb(function(error, result) {
  //
  //   // Make sure we got a row with the person, then prepare JSON to send back
  //   if (error || result == null || result.length != 1) {
  //     response.status(500).json({success: false, data: error});
  //   } else {
  //     response.status(200).json(result[0]);
  //   }
  // });

  console.log("author: " + author);
  console.log("title: " + story.title);
  console.log("content: " + story.content);


  return response;

}

function addStoryToDb(callback) {
  console.log("entering addStoryToDb() ");

  var client = (this.client || new pg.Client(connectionString));

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }
    // insert into stories (stories_title, stories_content) values ('Story Title', 'This story is awesome');
    var sql = "INSERT INTO stories (stories_title, stories_content, stories_author) VALUES ()";

    var query = client.query(sql, function (err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ");
        console.log(err);
        callback(err, null);
      }

      callback(null, result.rows);
    });
  });
}
