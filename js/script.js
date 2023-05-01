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

  // Overlay for background image
  displayBackgroundImage("movie", response.backdrop_path);

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
      ${response.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${response.release_date}</p>
    <p>
      ${response.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${response.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      response.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      response.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      response.revenue
    )}</li>
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

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];
  const response = await fetchAPIData(`tv/${showId}`);
  console.log(response);

  // Overlay for background image
  displayBackgroundImage("show", response.backdrop_path);

  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="details-top">
 <div>
 ${
   response.poster_path
     ? `    <img
src="https://image.tmdb.org/t/p/w500/${response.poster_path}"
class="card-img-top"
alt="${response.name}"
/>`
     : `    <img
src="images/no-image.jpg"
class="card-img-top"
alt="${response.name}"
/>`
 }
 </div>
 <div>
   <h2>${response.name}</h2>
   <p>
     <i class="fas fa-star text-primary"></i>
     ${response.vote_average} / 10
   </p>
   <p class="text-muted">Release Date: ${response.first_air_date}</p>
   <p>
     ${response.overview}
   </p>
   <h5>Genres</h5>
   <ul class="list-group">
     ${response.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
   </ul>
   <a href="${
     response.homepage
   }" target="_blank" class="btn">Visit Show Homepage</a>
 </div>
</div>
<div class="details-bottom">
 <h2>Show Info</h2>
 <ul>
   <li><span class="text-secondary">Number Of Episodes:</span> ${
     response.number_of_episodes
   }</li>
   <li>
     <span class="text-secondary">Last Episode To Air:</span> ${
       response.last_episode_to_air.name
     }
   </li>
   <li><span class="text-secondary">Status:</span> ${response.status}</li>
 </ul>
 <h4>Production Companies</h4>
 <div class="list-group">${response.production_companies
   .map((company) => `<li>${company.name}</li>`)
   .join("")}</div>
</div>`;

  document.querySelector("#show-details").appendChild(newDiv);
}

// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
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

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      ``;
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
