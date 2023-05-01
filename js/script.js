const navLinks = document.querySelector("#navlinks");
const popularMoviesEl = document.querySelector("#popular-movies");

const global = {
  currentPage: window.location.pathname,
};

// Fetch Data
async function fetchAPIData(endpoint) {
  showSpinner();
  const API_KEY = "1c17ca0eb6a609b26ef677e0da002e09";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  console.log("fetchdata", data);

  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Display results
function renderMovie(data) {
  const card = document.createElement("div");
  card.innerHTML = `        <div class="card">
    <a href="movie-details.html?id=${data.id}">

    ${
      data.poster_path
        ? `<img
    src="https://image.tmdb.org/t/p/w500/${data.poster_path}"
    class="card-img-top"
    alt="${data.title}"
  />`
        : `            <img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="Movie Title"
/>`
    }

    </a>
    <div class="card-body">
      <h5 class="card-title">${data.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${data.release_date}</small>
      </p>
    </div>
  </div>`;

  popularMoviesEl.appendChild(card);
}

// Renders top 20 popular movies
async function renderPopularmovies() {
  const { results } = await fetchAPIData("movie/popular");

  const popMovies = results;

  popMovies.forEach((movie) => {
    renderMovie(movie);
  });
}

//Renders top 20 popular TVshows
async function renderPopularTVShows() {
  const { results } = await fetchAPIData("tv/popular");

  const popTV = results;

  popTV.forEach((show) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("card");
    newDiv.innerHTML = `<a href="tv-details.html?id=${show.id}">

    ${
      show.poster_path
        ? `    <img
        src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`
        : `    <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
    }

  </a>
  <div class="card-body">
    <h5 class="card-title">${show.name}</h5>
    <p class="card-text">
      <small class="text-muted">Aired: ${show.first_air_date}</small>
    </p>
  </div>`;
    document.querySelector("#popular-shows").appendChild(newDiv);
  });
}

//Display single movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const response = await fetchAPIData(`movie/${movieId}`);
  console.log(response);
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="details-top">
  <div>
  ${
    response.poster_path
      ? `    <img
src="https://image.tmdb.org/t/p/w500/${response.poster_path}"
class="card-img-top"
alt="${response.title}"
/>`
      : `    <img
src="images/no-image.jpg"
class="card-img-top"
alt="${response.title}"
/>`
  }
  </div>
  <div>
    <h2>${response.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      8 / 10
    </p>
    <p class="text-muted">Release Date: ${response.release_date}</p>
    <p>
      ${response.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      <li>${response.genres[0].name}</li>
      <li>${response.genres[1].name}</li>
      <li>${response.genres[2].name}</li>
    </ul>
    <a href="${
      response.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${response.budget}</li>
    <li><span class="text-secondary">Revenue:</span> $${response.revenue}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      response.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${response.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"> ${response.production_companies
    .map((company) => {
      return `<li>${company.name}</li>`;
    })
    .join("")}</div>
</div>`;

  document.querySelector("#movie-details").appendChild(newDiv);
  console.log(response.production_companies);
}

//Highlight active link
const highlightActiveLink = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
};

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      renderPopularmovies();
      break;
    case "/shows.html":
      renderPopularTVShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      console.log("TV Details");
      break;
    case "/search.html":
      console.log("Search");
      ``;
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
