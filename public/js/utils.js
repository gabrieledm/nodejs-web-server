document.addEventListener('DOMContentLoaded', () => {
    console.log('Client side JavaScript file loaded correctly');

    const weatherForm = document.querySelector('#weather-form');
    const searchText = document.querySelector('#location-to-search');
    const foundLocation = document.querySelector('#found-location');
    const foundForecast = document.querySelector('#found-forecast');
    weatherForm.addEventListener('submit', listener => {
        // Prevent the default behaviour for submit action (which is the refresh of the page)
        listener.preventDefault();
        const locationToSearch = searchText.value;

        foundLocation.textContent = 'Loading...';
        foundForecast.textContent = '';

        const port = location.port;

        // Fetch a resource from the network
        fetch('http://localhost:' + port + '/weather?address=' + locationToSearch)
            .then(response => {
                response.json().then(data => {
                    if (data.error) {
                        foundLocation.textContent = data.error;
                    } else {
                        foundLocation.textContent = data.location;
                        foundForecast.textContent = data.forecast;
                    }
                });
            })
        ;
    });
});