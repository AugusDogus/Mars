var express = require('express');
var request = require('request');
var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars')
    .create({
        defaultLayout: 'main'
    });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    var name1 = getUsername();
    var name2 = getUsername();

    var link1 = createLink(name1);
    var link2 = createLink(name2)

    res.render('home', {
        links: [link1, link2]
    });
});

function createLink(username) {
    var uri = "https://secure.runescape.com/m=account-creation/g=oldscape/create_account?trialactive=true&displayname=" + username + "&email1=" + username + "@aug.dog&age=19&password1=augdog1&password2=augdog1";
    return uri;
}

function getUsername() {
    // Set the headers
    var headers = {
        'User-Agent': 'Mars',
        'Content-Type': 'application/form-data'
    }

    // Configure the request
    var options = {
        url: 'http://aug.dog/yang',
        method: 'POST',
        headers: headers
    }

    // Start the request
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log("Logging inside the request " + JSON.parse(body).name);
            var parsedBody = JSON.parse(body);
            var name = parsedBody.name;
            console.log(name);
            return name;
        } else {
            console.log(error);
        }
    })
}

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
