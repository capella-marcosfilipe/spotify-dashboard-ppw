import { config } from "./config.js";

function handleError(error) {
  console.error("Deu ruim: ", error.message);
}

async function getTopFiveSongs() {
  /**
   * Recupera as top 5 músicas e renderiza para o front end.
   */
  try {
    const url = "https://parseapi.back4app.com/parse/classes/songs";
    const params =
      "?order=-streams&limit=5&keys=track_name,artist_name,streams";

    const songs = await fetchSongs(`${url}${params}`, {
      "X-Parse-Application-Id": config.applicationId,
      "X-Parse-REST-API-Key": config.restAPIKey,
      "Content-Type": "application/json",
    });

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
      <span class="fs-4 fw-bold">${song.track_name}</span><br>
      <span class="fs-6 fw-light">Artista:</span> <span class="fs-5 fw-semibold">${
        song.artist_name
      }</span><br>
      <span class="fs-6 fw-light">Streams:</span> <span class="fs-5 fw-semibold">${song.streams.toLocaleString(
        "pt-br"
      )}</span>
    `;
    songsList.appendChild(listItem);
  });
}

async function fetchSongs(url, headers) {
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

// Funções executadas ao carregar a página
getTopFiveSongs();
