// LocalStorage helpers

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

// ScreeningID parser when using UUID


function parseScreeningID(screeningID) {
  const parts = screeningID.split("-");
  const time = parts.pop();              
  const day = Number(parts.pop());      
  const movieId = parts.join("-");       

  return { movieId, day, time };
}


function clearTables() {
  document.querySelector("#saturday tbody").innerHTML = "";
  document.querySelector("#sunday tbody").innerHTML = "";
}

function getTbodyForDay(day) {
  if (day === 1) return document.querySelector("#saturday tbody");
  if (day === 2) return document.querySelector("#sunday tbody");
  return null;
}

// Main renderer
async function renderSchedule() {
  clearTables();

  const bookings = getBookings();
  if (bookings.length === 0) return;

  const response = await fetch("movies.json");
  const movies = await response.json();

  // Build lookup map: UUID -> movie
  const movieMap = {};
  movies.forEach(movie => {
    movieMap[movie.id] = movie;
  });

  const entries = bookings
    .map(screeningID => {
      const { movieId, day, time } = parseScreeningID(screeningID);
      const movie = movieMap[movieId];

      if (!movie) return null;

      return {
        screeningID,
        day,
        time,
        movie
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Render rows
  entries.forEach(entry => {
    const tbody = getTbodyForDay(entry.day);
    if (!tbody) return;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <div class="posterbox">
          <img class="card-img"
               src="${entry.movie.poster}"
               alt="Movie poster for ${entry.movie.title}">
        </div>
      </td>

      <td>${entry.time.slice(0, 5)}</td>

      <td class="center">
        <span class="hide2">Screen</span>
        <span class="bold-nr">${entry.movie.screen}</span>
      </td>

      <td>
        <strong>${entry.movie.title}</strong>
        <span class="hide1"><br>${entry.movie.synopsis}</span>
      </td>

      <td>
        <button class="cancel-button"
                data-screening="${entry.screeningID}"
                data-title="${entry.movie.title}"
                data-time="${entry.time.slice(0, 5)}"
                data-day="${entry.day}">
          CANCEL
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  attachCancelHandlers();
}

// Cancel logic + confirmation

function attachCancelHandlers() {
  document.querySelectorAll(".cancel-button").forEach(button => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      const time = button.dataset.time;
      const dayNum = Number(button.dataset.day);

      const dayMap = { 1: "Saturday", 2: "Sunday" };
      const dayName = dayMap[dayNum] || "Unknown day";

      const confirmed = confirm(
        `Are you sure you want to cancel the screening of "${title}" on ${dayName} at ${time}?`
      );

      if (!confirmed) return;

      const screeningID = button.dataset.screening;

      let bookings = getBookings();
      let seatMap = getSeatMap();

      bookings = bookings.filter(id => id !== screeningID);

      if (screeningID in seatMap) {
        seatMap[screeningID]++;
      }

      saveBookings(bookings);
      saveSeatMap(seatMap);

      renderSchedule();
    });
  });
}

renderSchedule();
