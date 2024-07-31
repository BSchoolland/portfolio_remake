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
const checkInterval = 1000; // Check every 5 seconds
const timeout = 60000; // 60 seconds timeout

let elapsedTime = 0;

function checkHerokuApp() {
    fetch(herokuAppUrl)
        .then(response => {
            // If fetch does not throw and we get a response, consider the server ready.
            window.location.href = herokuAppUrl; // Redirect to the Heroku app
        })
        .catch(error => {
            // If there's an error, we assume that the server must have sent that error, meaning it may not allow CORS but it is up.
            window.location.href = herokuAppUrl;
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
