const express = require('express');
var router = express.Router();
const app = express();
const pg = require('pg');
const url = require('url');
const XMLHttpRequest = require(xmlhttprequest).XMLHttpRequest;

const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname), 'public')),




function searchMovie() {

  var movie = "http://www.omdbapi.com/?" + title + "&apikey=72a51384"

}

function loadMovie(movie) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", movie, true);
  xhttp.send();
}