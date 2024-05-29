function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

const herokuAppUrl = getQueryVariable('projectUrl');
const checkInterval = 5000; // Check every 5 seconds
const timeout = 60000; // 60 seconds timeout

let elapsedTime = 0;

function checkHerokuApp() {
    fetch(herokuAppUrl)
        .then(response => {
            // If fetch does not throw and we get a response, consider the server ready.
            window.location.href = herokuAppUrl; // Redirect to the Heroku app
        })
        .catch(error => {
            // Check if the error is a CORS error indicating the server is up
            if (error.message.includes('Failed to fetch')) {
                // Assume CORS error means server is awake, redirect.
                window.location.href = herokuAppUrl;
            } else if (elapsedTime < timeout) {
                // If not a CORS error and time is left, keep checking.
                setTimeout(checkHerokuApp, checkInterval);
                elapsedTime += checkInterval;
                updateLoadingMessage(elapsedTime);
            } else {
                // If timeout, display an error message.
                displayErrorMessage();
            }
        });
}

function updateLoadingMessage(time) {
    document.getElementById('loadingMessage').textContent = `Loading, please wait... ${time / 1000} seconds`;
}

function displayErrorMessage() {
    document.getElementById('loadingMessage').textContent = 'Failed to load the project, please try again later.';
}

if (herokuAppUrl) {
    // set the a tag to point to the url
    document.getElementById("manualLink").href = herokuAppUrl
    checkHerokuApp(); // Start the check when the page loads
} else {
    displayErrorMessage('Invalid project URL.');
}
