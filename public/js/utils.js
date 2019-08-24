document.addEventListener('DOMContentLoaded', () => {
    console.log('Client side JavaScript file loaded correctly');

    const weatherForm = document.querySelector('#weather-form');
    const searchText = document.querySelector('#location-to-search');
    const foundLocation = document.querySelector('#found-location');
    const foundForecast = document.querySelector('#found-forecast');
    weatherForm.addEventListener('submit', listener => {
        // Prevent the default behaviour for submit action (which is the refresh of the page)
        listener.preventDefault();
        const location = searchText.value;

        foundLocation.textContent = 'Loading...';
        foundForecast.textContent = '';

        // Fetch a resource from the network
        fetch('http://localhost:3000/weather?address=' + location)
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