# Unlox — Weather & Movie Explorer

Unlox is a responsive web application that brings weather information and movie discovery together in one place. Users can explore current weather conditions for cities and search for movies to discover their details.

The project is built using HTML, CSS and vanilla JavaScript, with data retrieved from public APIs.

## Features

### Weather Explorer
- Search for a city and retrieve its current weather.
- Display temperature and weather conditions.
- Show humidity, wind speed and feels-like temperature.
- Handle invalid city searches and API errors.
- Present weather information in a responsive interface.

### Movie Explorer
- Search for movies by title.
- Display movie posters and available movie information.
- Explore ratings, release dates and descriptions.
- Handle empty searches and unsuccessful API requests.
- View additional movie details where supported by the application.

### User Interface
- Consistent Unlox branding across all pages.
- Forest Green and Cream colour palette.
- Responsive navigation and layouts.
- Subtle animated background and interactive hover effects.
- Dedicated Home, Weather and Movies pages.

## Technologies Used

- **HTML5** — Page structure and content.
- **CSS3** — Styling, responsive layouts and animations.
- **JavaScript (ES6+)** — Application logic and DOM interaction.
- **Fetch API** — Retrieving data from external APIs.
- **Async/Await** — Handling asynchronous operations.
- **Open-Meteo API** — Weather and geocoding data.
- **TMDB API** — Movie search and movie information.
- **Git & GitHub** — Version control and project hosting.

## Project Structure

```text
Minor-Project-Weather-Movie-App/
│
├── index.html
│
├── css/
│   └── global.css
│
├── js/
│   └── main.js
│
├── weather/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── movies/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.example.js
│   └── config.js              # Local API configuration; not committed
│
├── assets/
│   └── images/
│
├── .gitignore
└── README.md
```

## APIs

### Open-Meteo

Unlox uses Open-Meteo for geocoding and weather information.

- Geocoding API: https://geocoding-api.open-meteo.com/
- Weather API: https://open-meteo.com/

Open-Meteo provides weather data without requiring an API key for this project.

### The Movie Database (TMDB)

The movie explorer uses TMDB to retrieve movie search results and related information.

- Website: https://www.themoviedb.org/
- API documentation: https://developer.themoviedb.org/docs

A TMDB API key is required for movie-related requests.

## Setup and Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd Minor-Project-Weather-Movie-App
```

### 3. Configure the TMDB API key

Create your local configuration file using the provided example:

```bash
cp movies/config.example.js movies/config.js
```

Add your TMDB API key to `movies/config.js`, following the configuration format used by the project.

**Important:** `movies/config.js` is excluded through `.gitignore`. Do not upload your personal API key to GitHub.

### 4. Run the application

Open the root `index.html` using a local development server, such as the VS Code Live Server extension.

The application can then be accessed through the local server in your browser.

## Learning Outcomes

This project demonstrates practical use of:

- Semantic HTML and responsive CSS.
- JavaScript ES6+ syntax and functions.
- DOM manipulation and event handling.
- Fetch API and JSON response processing.
- Promises, async/await and error handling.
- Integration of third-party APIs.
- Git and GitHub version control.

## Project Purpose

Unlox was developed as an academic web development project to demonstrate the integration of external APIs with a responsive and interactive frontend application.

---

**Unlox — Explore your world, one search at a time.**