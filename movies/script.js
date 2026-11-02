"use strict";

import { TMDB_API_KEY } from "./config.js";

const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieForm = document.getElementById("movieForm");
const movieInput = document.getElementById("movieInput");
const movieResults = document.getElementById("movieResults");
const movieMessage = document.getElementById("movieMessage");

const movieModal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

// Search movies from TMDB.
async function searchMovies(query) {
    const url = `${API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to retrieve movies. Check your API key.");
    }

    const data = await response.json();

    return data.results || [];
}

// Create a movie card using DOM elements.
function createMovieCard(movie) {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.tabIndex = 0;

    const title = movie.title || "Untitled";
    const releaseDate = movie.release_date || "Release date unavailable";
    const rating = Number(movie.vote_average || 0).toFixed(1);

    if (movie.poster_path) {
        const poster = document.createElement("img");
        poster.className = "movie-poster";
        poster.src = `${IMAGE_URL}${movie.poster_path}`;
        poster.alt = `${title} movie poster`;
        poster.loading = "lazy";
        card.appendChild(poster);
    } else {
        const placeholder = document.createElement("div");
        placeholder.className = "poster-placeholder";
        placeholder.textContent = title;
        card.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "movie-info";

    info.innerHTML = `
        <h3>${escapeHTML(title)}</h3>
        <div class="movie-meta">
            <span>${escapeHTML(releaseDate.slice(0, 4) || "N/A")}</span>
            <span class="movie-rating">★ ${rating}</span>
        </div>
    `;

    card.appendChild(info);

    card.addEventListener("click", () => showMovieDetails(movie));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showMovieDetails(movie);
        }
    });

    return card;
}

// Escape text before inserting API values into HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Display movie cards.
function displayMovies(movies) {
    movieResults.replaceChildren();

    movies.forEach((movie) => {
        const card = createMovieCard(movie);
        movieResults.appendChild(card);
    });
}

// Display detailed information about a selected movie.
function showMovieDetails(movie) {
    const title = movie.title || "Untitled";
    const overview = movie.overview || "No description available.";
    const releaseDate = movie.release_date || "Not available";
    const rating = Number(movie.vote_average || 0).toFixed(1);

    const poster = movie.poster_path
        ? `<img class="modal-poster" src="${IMAGE_URL}${movie.poster_path}" alt="${escapeHTML(title)} poster">`
        : "";

    modalDetails.innerHTML = `
        <div class="modal-details">
            ${poster}
            <p class="eyebrow">MOVIE DETAILS</p>
            <h2>${escapeHTML(title)}</h2>
            <p><strong>Release date:</strong> ${escapeHTML(releaseDate)}</p>
            <p><strong>Rating:</strong> ★ ${rating}/10</p>
            <p>${escapeHTML(overview)}</p>
        </div>
    `;

    movieModal.classList.remove("hidden");
}

// Handle the search form.
movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = movieInput.value.trim();

    if (!query) {
        movieMessage.textContent = "Please enter a movie name.";
        return;
    }

    movieMessage.textContent = "Searching for movies...";
    movieResults.replaceChildren();

    try {
        if (TMDB_API_KEY === "PASTE_YOUR_TMDB_API_KEY_HERE" ||
            TMDB_API_KEY === "YOUR_TMDB_API_KEY_HERE") {
            throw new Error("Please add your TMDB API key in movies/config.js.");
        }

        const movies = await searchMovies(query);

        if (movies.length === 0) {
            movieMessage.textContent = "No movies found. Try another search.";
            return;
        }

        displayMovies(movies);
        movieMessage.textContent = `Found ${movies.length} results for "${query}".`;

    } catch (error) {
        movieMessage.textContent = error.message;

    } finally {
        console.log("Movie search completed.");
    }
});

// Close the movie details modal.
closeModal.addEventListener("click", () => {
    movieModal.classList.add("hidden");
});

movieModal.addEventListener("click", (event) => {
    if (event.target === movieModal) {
        movieModal.classList.add("hidden");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        movieModal.classList.add("hidden");
    }
});