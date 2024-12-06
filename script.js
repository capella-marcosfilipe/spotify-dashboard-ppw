import { config } from "./config.js";

// Métodos genéricos ========================

function handleError(error) {
  console.error("Deu ruim: ", error.message);
}

async function fetchSongs(
  url,
  headers = {
    "X-Parse-Application-Id": config.applicationId,
    "X-Parse-REST-API-Key": config.restAPIKey,
    "Content-Type": "application/json",
  }
) {
  /**
   * Solicita para o backend as músicas que quer.
   *
   * url (str): url com os parâmetros de busca
   * headers (Object).
   */
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const { results } = await response.json();
  return results;
}

// Métodos de Top 5 músicas ========================

async function fetchTopFiveSongs() {
  /**
   * Recupera as top 5 músicas e renderiza para o front end.
   */
  try {
    const url = "https://parseapi.back4app.com/parse/classes/songs";
    const params =
      "?order=-streams&limit=5&keys=track_name,artist_name,streams";

    const songs = await fetchSongs(`${url}${params}`);

    renderSongsList("songs-list", songs);
  } catch (error) {
    handleError(error);
  }
}

function renderSongsList(elementId, songs) {
  /**
   * Formata as músicas encontradas em HTML
   */
  const songsList = document.getElementById(elementId);

  songsList.innerHTML = "";

  songs.forEach((song) => {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "bg-success",
      "bg-opacity-10",
      "text-light",
      "border",
      "border-0"
    );
    listItem.innerHTML = `
      <span class="fs-5 fw-bold">${song.track_name}</span><br>
      <span class="fs-6 fw-light">Artista:</span> <span class="fs-5 fw-semibold">${
        song.artist_name
      }</span><br>
      <span class="fs-6 fw-light">Streams:</span> <span class="fs-6 fw-semibold">${song.streams.toLocaleString(
        "pt-br"
      )}</span>
    `;
    songsList.appendChild(listItem);
  });
}

// Métodos de Músicas por BPM ========================

async function fetchSongsByBpm(minBpm = 100, maxBpm = 120) {
  try {
    const url = `https://parseapi.back4app.com/parse/classes/songs?order=-streams&limit=3&keys=track_name,artist_name,streams,bpm&where=${encodeURIComponent(
      JSON.stringify({ bpm: { $gte: minBpm, $lte: maxBpm } })
    )}`;

    const songs = await fetchSongs(url);

    renderBPMSongsList("bpm-list", songs);
  } catch (error) {
    handleError(error);
  }
}

function renderBPMSongsList(elementId, songs) {
  /**
   * Formata as músicas encontradas em HTML
   */
  const songsList = document.getElementById(elementId);

  songsList.innerHTML = "";

  songs.forEach((song) => {
    const listItem = document.createElement("li");
    listItem.classList.add(
      "list-group-item",
      "bg-success",
      "bg-opacity-10",
      "text-light",
      "border",
      "border-0"
    );
    listItem.innerHTML = `
      <span class="fs-5 fw-bold">${song.track_name}</span><br>
      <span class="fs-6 fw-light">Artista:</span> <span class="fs-6 fw-semibold">${
        song.artist_name
      }</span><br>
      <span class="fs-6 fw-light">BPM:</span> <span class="text-danger-emphasis fs-6 fw-semibold">${
        song.bpm
      }</span><br>
      <span class="fs-6 fw-light">Streams:</span> <span class="fs-6 fw-semibold">${song.streams.toLocaleString(
        "pt-br"
      )}</span>
    `;
    songsList.appendChild(listItem);
  });
}

// Métodos de Encontre a letra ========================

const getLyricsButton = document.getElementById("get-lyrics");
const lyricsDiv = document.getElementById("lyrics");
const artistSelect = document.getElementById("artist-select");
const songSelect = document.getElementById("song-select");

// Alimentar seletor de artistas
async function fetchArtistsForSelect() {
  try {
    const response = await fetch(
      `https://parseapi.back4app.com/parse/classes/songs?keys=artist_name`,
      {
        headers: {
          "X-Parse-Application-Id": config.applicationId,
          "X-Parse-REST-API-Key": config.restAPIKey,
        },
      }
    );

    const { results } = await response.json();

    const uniqueArtists = [...new Set(results.map((song) => song.artist_name))];

    uniqueArtists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist;
      option.textContent = artist;
      artistSelect.appendChild(option);
    });
  } catch (error) {
    handleError(error);
  }
}

// Alimentar seletor de músicas por artista escolhido
async function fetchSongsByArtistForSelect(artist) {
  try {
    const response = await fetch(
      `https://parseapi.back4app.com/parse/classes/songs?keys=track_name,artist_name&where=${encodeURIComponent(
        JSON.stringify({ artist_name: artist })
      )}`,
      {
        headers: {
          "X-Parse-Application-Id": config.applicationId,
          "X-Parse-REST-API-Key": config.restAPIKey,
        },
      }
    );

    const { results } = await response.json();

    results.forEach((song) => {
      const option = document.createElement("option");
      option.value = song.track_name;
      option.textContent = song.track_name;
      songSelect.appendChild(option);
    });

    songSelect.disabled = false;
  } catch (error) {
    handleError(error);
  }
}

// Busca Música com as informações selecionadas pelo usuário
async function fetchLyrics(artistName, trackName) {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedSong = encodeURIComponent(trackName);

  const url = `https://private-anon-77d17e283b-lyricsovh.apiary-proxy.com/v1/${encodedArtist}/${encodedSong}`;
  console.log(url);

  try {
    const response = await fetch(url);
    const result = await response.json();

    console.log(result.lyrics);

    if (result && result.lyrics) {
      renderLyrics("lyrics", result.lyrics);
    } else {
      renderLyrics("lyrics", "Lyrics not found.");
    }
  } catch (error) {
    handleError(error);
  }
}

// Método auxiliar de fetchLyrics para renderizar
function renderLyrics(elementId, lyrics) {
  /**
   * Formata a letra das músicas em HTML
   */
  const lyricsDisplay = document.getElementById(elementId);
  lyricsDisplay.innerHTML = "";

  const formattedLyrics = lyrics.replace(/(\r\n|\n|\r)/g, "<br>");
  lyricsDisplay.innerHTML = formattedLyrics;
}

// Event listeners ========================
document.addEventListener("DOMContentLoaded", () => {
  const bpmForm = document.getElementById("bpm-form");

  bpmForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const minBpm = parseInt(document.getElementById("min-bpm").value, 10);
    const maxBpm = parseInt(document.getElementById("max-bpm").value, 10);

    if (minBpm && maxBpm && minBpm <= maxBpm) {
      fetchSongsByBpm(minBpm, maxBpm);
    } else {
      alert("Por favor, coloque um intervalo válido de BPM");
    }
  });
});

artistSelect.addEventListener("change", () => {
  const selectedArtist = artistSelect.value;
  fetchSongsByArtistForSelect(selectedArtist);
});

songSelect.addEventListener("change", () => {
  getLyricsButton.disabled = !songSelect.value;
});

getLyricsButton.addEventListener("click", () => {
  const selectedArtist = artistSelect.value;
  const selectedSong = songSelect.value;

  fetchLyrics(selectedArtist, selectedSong);
});

document.addEventListener("DOMContentLoaded", fetchArtistsForSelect);

// Funções executadas ao carregar a página
fetchTopFiveSongs();
fetchSongsByBpm();
