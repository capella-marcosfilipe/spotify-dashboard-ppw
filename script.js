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

  if (!songsList) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  songsList.innerHTML = "";

  songs.forEach((song) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>${song.track_name}</strong><br>
      Artist: ${song.artist_name}<br>
      Streams: ${song.streams}
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

  return result;
}

getTopFiveSongs();
