// LocalStorage manipulation

function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function getSeatMap() {
  return JSON.parse(localStorage.getItem("seatMap")) || {};
}

function saveSeatMap(seatMap) {
  localStorage.setItem("seatMap", JSON.stringify(seatMap));
}

// ScreeningID parser (UUID-safe)

function parseScreeningID(screeningID) {
  const parts = screeningID.split("-");
  const time = parts.pop();
  const day = Number(parts.pop());
  const movieId = parts.join("-");
  return { movieId, day, time };
}

// Time helpers

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function getTimeRange(startTime, runtime) {
  const start = timeToMinutes(startTime);
  const end = start + runtime;
  return { start, end };
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

// Main loader

let cachedMovies = [];

async function loadMovies() {
  const response = await fetch("movies.json");
  cachedMovies = await response.json();

  const dayMap = { 1: "SATURDAY", 2: "SUNDAY" };

  const container = document.getElementById("movieContainer");
  container.innerHTML = "";

  const bookings = getBookings();
  const seatMap = getSeatMap();

  cachedMovies.forEach((movie, movieIndex) => {
    const card = document.createElement("div");
    card.className = "card";

    const bookingHTML = movie.showtimes
      .map((time, timeIndex) => {
        const screeningID = `${movie.id}-${movie.day}-${time}`;

        // Initialize seat count when first seen
        if (!(screeningID in seatMap)) {
          seatMap[screeningID] = movie.seats[timeIndex];
        }

        const isBooked = bookings.includes(screeningID);
        const seatsLeft = seatMap[screeningID];

        return `
          <div class="book-wrapper">
            <button
              class="${isBooked ? "cancel-button" : "book-button"}"
              data-movie="${movieIndex}"
              data-timeindex="${timeIndex}"
              ${!isBooked && seatsLeft === 0 ? "disabled" : ""}
            >
              <div>${isBooked ? "CANCEL" : "BOOK"}</div>
              <div>${time.slice(0, 5)}</div>
            </button>
            <p class="seats">Seats: ${seatsLeft}</p>
          </div>
        `;
      })
      .join("");

    card.innerHTML = `
      <div class="posterbox">
        <img class="card-img" src="${movie.poster}" alt="${movie.title} poster">
      </div>

      <div class="card-content">
        <div class="screen">
          <p class="screen-number">Screen ${movie.screen}</p>
          <p class="screening-day">${dayMap[movie.day]}</p>
        </div>

        <h3 class="film-title">${movie.title}</h3>
        <p class="film-year">${movie.year}</p>
        <p class="film-plot">${movie.synopsis}</p>
        <p class="film-cast">
          <span>Cast</span> ${movie.cast.join(", ")}
        </p>

        <div class="booking">${bookingHTML}</div>
      </div>
    `;

    container.appendChild(card);
  });

  saveSeatMap(seatMap);
  attachBookingHandlers();
}

// Booking / Cancel / Overlap handling

function attachBookingHandlers() {
  document
    .querySelectorAll(".book-button, .cancel-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const movieIndex = Number(button.dataset.movie);
        const timeIndex = Number(button.dataset.timeindex);

        const movie = cachedMovies[movieIndex];
        const time = movie.showtimes[timeIndex];
        const screeningID = `${movie.id}-${movie.day}-${time}`;

        let bookings = getBookings();
        let seatMap = getSeatMap();

        // CANCEL
        if (bookings.includes(screeningID)) {
          bookings = bookings.filter((id) => id !== screeningID);
          seatMap[screeningID]++;
          saveBookings(bookings);
          saveSeatMap(seatMap);
          loadMovies();
          return;
        }

        // BOOK — check for Overlap
        const newRange = getTimeRange(time, movie.runtime);

        let conflictingID = null;
        let conflictingMovie = null;

        for (const id of bookings) {
          const parsed = parseScreeningID(id);

          if (parsed.day !== movie.day) continue;

          const bookedMovie = cachedMovies.find((m) => m.id === parsed.movieId);
          if (!bookedMovie) continue;

          const bookedRange = getTimeRange(parsed.time, bookedMovie.runtime);

          if (overlaps(newRange, bookedRange)) {
            conflictingID = id;
            conflictingMovie = bookedMovie;
            break;
          }
        }

        if (conflictingID) {
          const proceed = confirm(
            `This movie overlaps with "${conflictingMovie.title}".\n\n` +
              `Booking this will cancel the other screening.\n\nContinue?`
          );

          if (!proceed) return;

          bookings = bookings.filter((id) => id !== conflictingID);
          seatMap[conflictingID]++;
        }

        // Final booking
        if (seatMap[screeningID] === 0) return;

        bookings.push(screeningID);
        seatMap[screeningID]--;

        saveBookings(bookings);
        saveSeatMap(seatMap);
        loadMovies();
      });
    });
}

loadMovies();
