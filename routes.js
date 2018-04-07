module.exports = function(app) {

  // Home
  app.get('/', function (req, res) {
    res.render('index')
  });

  // Display a single story
  app.get('/story/:id', function (req, res) {
    res.render('story');
  });

  // Add a story
  app.get('/add', function (req, res) {
    res.render('add')
  });

  // Login/logout
  app.get('/user', function (req, res) {
    res.render('login')
  });


}