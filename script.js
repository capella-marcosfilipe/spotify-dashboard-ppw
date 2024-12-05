import { config } from "./config.js";

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

async function getLyrics(artistName, trackName) {
  artistName = encodeURIComponent(artistName);
  trackName = encodeURIComponent(trackName);

  try {
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${artistName}/${trackName}`
    );
  } catch (error) {
    handleError(error);
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const result = response.json();

  renderLyrics("lyrics-display", result);
}

function renderLyrics(elementId, lyrics) {
  /**
   * Formata a letra das músicas em HTML
   */
  const lyricsDisplay = document.getElementById(elementId);

  lyricsDisplay = lyrics; // Falta formatar
}

async function getTopArtists() {
  // pegar as infos do back4app
  // formatar em html
  // mandar pro frontend
}

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

// Event listeners
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

// Funções executadas ao carregar a página
fetchTopFiveSongs();
fetchSongsByBpm();
getTopArtists();
