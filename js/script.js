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

  console.log(popularMoviesEl);
  popularMoviesEl.appendChild(card);
}

async function renderPopularmovies() {
  const { results } = await fetchAPIData("movie/popular");

  const popMovies = results;

  popMovies.forEach((movie) => {
    renderMovie(movie);
  });
}

async function renderPopularTVShows() {
  const { results } = await fetchAPIData("tv/popular");

  const popTV = results;
  console.log("TV", popTV);

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
      console.log("Home");
      break;
    case "/shows.html":
      renderPopularTVShows();
      console.log("Shows");
      break;
    case "/movie-details.html":
      console.log("movie details");
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
