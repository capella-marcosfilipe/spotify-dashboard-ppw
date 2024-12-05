import { config } from "./config.js";

async function getTopFiveSongs() {
  try {
    const response = await fetch(
      "https://parseapi.back4app.com/parse/classes/songs?order=-streams&limit=5&keys=track_name,artist_name,streams",
      {
        headers: {
          "X-Parse-Application-Id": config.applicationId,
          "X-Parse-REST-API-Key": config.restAPIKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const { results } = await response.json();

    // return results;
    const songsList = document.getElementById("songs-list");

    songsList.innerHTML = "";

    results.forEach((song) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${song.track_name}</strong><br>
        Artist: ${song.artist_name}<br>
        Streams: ${song.streams}
      `;
      songsList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Deu ruim: ", error.message);
  }
}

// const [song1, song2, song3, song4, song5] = await getTopFiveSongs();

// console.log("Song 1:", song1);
// console.log("Song 2:", song2);
// console.log("Song 3:", song3);
// console.log("Song 4:", song4);
// console.log("Song 5:", song5);

getTopFiveSongs();
