const path = require('path');
const express = require('express');
const hbs = require('hbs');
const weather = require('./utils/weather');
const geoLocation = require('./utils/geo-location');

// Create the Express web application
const app = express();

// Get the 'public' folder from the current directory
const publicDirectory = path.join(__dirname, '../public');
// Get the 'templates/views' folder from the current directory
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set the 'view engine' of the application as 'hbs' (an Express.js view engine for handlebars.js)
app.set('view engine', 'hbs');
// Set the location of the views of the web-application
app.set('views', viewsPath);
// Register the folder containing the partial templates for the web-application
hbs.registerPartials(partialsPath);

// Use the passed middleware function in the web-application
// In this way the web-application can serve the content of the 'public' folder by using the '/<location-of-the-static-resource>' path
app.use(
    // Creates a middleware function to serve files from within a given root directory
    // This will result in serving all files contained in the 'public' directory of the project
    express.static(publicDirectory)
);

const createdBy = 'Gabriele Del Monte';

// Maps the base URL of the web-application
app.get('', (request, response) => {
    // Renders the web-application to a specified view
    // In this way the web view will be rendered to the 'index.hbs' template created in the 'views' folder
    // Passing 'options' is possible inject values to the rendered view
    response.render('index', {
        // Set the values of the variables used in the rendered view template
        title: 'Weather App',
        name: createdBy
    });
});

app.get('/about', (request, response) => {
    response.render('about', {
        title: 'About Me',
        name: createdBy
    });
});

app.get('/help', (request, response) => {
    response.render('help', {
        title: 'Help',
        name: createdBy,
        message: 'Help message'
    });
});

app.get('/help/*', (request, response) => {
    response.render('errors/404', {
        title: 'Page not found',
        name: createdBy,
        message: 'Help article not found'
    });
});

app.get('/weather', (request, response) => {
    const queryString = request.query;
    if (!queryString.address) {
        // Use 'return' to make sure the function stops the execution
        return response.send({
            error: 'You must provide an address'
        });
    }

    geoLocation.geoCode(queryString.address, (errorMessage, geoCodeData) => {
        if (errorMessage) {
            return response.send({
                error: errorMessage
            });
        }

        weather.getWeather(geoCodeData, (errorMessage, weatherData) => {
            if (errorMessage) {
                return response.send({
                    error: errorMessage
                });
            }
            response.send({
                forecast: weatherData,
                location: geoCodeData.location,
                address: queryString.address
            });
        });
    });
});

app.get('/products', (request, response) => {
    // 'request.query' - retrieves json object with key-value pairs of the query string for the received request
    // 'request.query.<key-name>' - retrieves the value associated with the passed <key-name>
    console.log(request.query);

    const queryString = request.query;
    if (!queryString.search) {
        return response.send({
            error: 'You must provide a search term'
        });
    }
    response.send({
        products: []
    });
});

// Using '*' wildcard at the end of the URLs mapping is possible match everything that has not been matched so far
app.get('*', (request, response) => {
    response.render('errors/404', {
        title: 'Page not found',
        name: createdBy,
        message: 'The page you are looking for not exists'
    });
});

// Use 'process.env.PORT' to get the 'PORT' variable from environment variables passed by Heroku
const port = process.env.PORT || 3000;
// Start listening of the web application on passed port
app.listen(port, () => console.log(`Server is up on port ${port}`));