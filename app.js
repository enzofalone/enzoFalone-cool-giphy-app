const API_KEY = 'API KEY HERE'

// GLOBAL CONSTANTS

// API request params
const limit = 9; // limit of received files per request
const rating = 'g'; // audience rating of images
const lang = 'en'; // gif language

// elements
const mainEl = document.querySelector('main');
const form = document.querySelector('form');
const resetButton = document.querySelector('#button-reset');

const sectionEl = document.querySelector('section');
const gifContainer = sectionEl.querySelector('#container');
const showMoreButton = sectionEl.querySelector('.button-more');

// variables
let pages = 0;
let lastUserQuery = '';
let userQuery = 'foo';

// trending request
async function getTrending() {
    let response = await fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${limit}&rating=${rating}`);
    // finish request by converting to json
    let jsonResponse = await response.json();

    // pass data to be displayed
    displayResults(jsonResponse.data);
}

// query request
async function getResults(e) {
    // prevent the page from reloading
    e.preventDefault();

    userQuery = form.query.value;

    //if query changed, reset pages.
    if (lastUserQuery !== userQuery) {
        pages = 0;
        lastUserQuery = userQuery;
    }

    // send query with predefined parameters
    let response = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${userQuery}&limit=${limit}&rating=${rating}&lang=${lang}&offset=${pages*limit}`);

    // finish request by converting to json
    let jsonResponse = await response.json();

    // increment pages variable;
    pages++;

    // pass data to be displayed
    displayResults(jsonResponse.data);
}

const showShowMoreButton = (section) => {
    if (showMoreButton.classList.contains("hidden")) {
        showMoreButton.classList.remove("hidden");
    }
}

const hideShowMoreButton = () => {
    if (!showMoreButton.classList.contains("hidden")) {
        showMoreButton.classList.add("hidden");
    }
}

const cleanResults = () => {
    gifContainer.innerHTML = ``;
    hideShowMoreButton();
}

const displayResults = (dataObject) => {
    // clear area
    cleanResults();

    // reset pages as it is a new query
    console.log("displaying results...")
    // iterate through object to 
    dataObject.forEach((val) => {
        gifContainer.innerHTML += `<img class="result-image"src="${val.images.original.url}">`
    });

    // add a "Show more!" button
    showShowMoreButton();
}

window.onload = () => {
    //add listeners here
    form.addEventListener('submit', getResults);
    showMoreButton.addEventListener('click', getResults);
    resetButton.addEventListener('click', cleanResults);
    // retrieve trending results just once
    getTrending();
}