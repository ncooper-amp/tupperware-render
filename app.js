var express = require('express')
  , amp = require('cms-javascript-sdk')
  , app = express()
  , expressHbs = require('express-handlebars')
  , axios = require('axios')
  , helpers = require('handlebars-helpers')(['array', 'object']);

app.use("/static",express.static(__dirname + '/static/'))
app.set('view engine', 'hbs')



app.engine('hbs', expressHbs( {
  extname: 'hbs',
  layoutsDir: __dirname + '/views/',
  partialsDir: __dirname + '/views/partials/',
  helpers
} ) );


app.get('/', function (req, res, next) {

  try {
    axios.get("http://qa-tupp-alb-9m2gkk2q44wy-713027552.eu-west-1.elb.amazonaws.com/cms/content/query?fullBodyObject=true&query=%7B%22sys.iri%22:%22http://content.cms.amplience.com/"+ req.query.id +"%22%7D&scope=tree&store=" + req.query.store)
      .then(response => {
        var contentGraph = amp.inlineContent(response.data);
        stringContent = JSON.stringify(contentGraph,null,'\t');
        res.render('homepage',{'contentGraph': contentGraph, 'stringContent' : stringContent, 'reqParams': req.query});
      })
      .catch(error => {
        console.log(error);
      });
  } catch (e) {
    next(e)
  }
})

app.get('/debug', function (req, res, next) {

  try {
    axios.get("http://qa-tupp-alb-9m2gkk2q44wy-713027552.eu-west-1.elb.amazonaws.com/cms/content/query?fullBodyObject=true&query=%7B%22sys.iri%22:%22http://content.cms.amplience.com/"+ req.query.id +"%22%7D&scope=tree&store=" + req.query.store)
      .then(response => {
        var contentGraph = amp.inlineContent(response.data);
        stringContent = JSON.stringify(contentGraph,null,'\t');
        console.log(contentGraph);
        res.render('debug',{'contentGraph': contentGraph, 'stringContent' : stringContent, 'reqParams': req.query});
      })
      .catch(error => {
        console.log(error);
      });
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
