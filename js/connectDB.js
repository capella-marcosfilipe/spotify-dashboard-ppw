import dotenv from "dotenv";
dotenv.config();

const applicationId = process.env.APPLICATION_ID;
const restAPIKey = process.env.REST_API_KEY;

async function getTopFiveSongs() {
  try {
    const response = await fetch(
      "https://parseapi.back4app.com/parse/classes/songs?order=-streams&limit=5&keys=track_name,artist_name,streams",
      {
        headers: {
          "X-Parse-Application-Id": applicationId,
          "X-Parse-REST-API-Key": restAPIKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const { results } = await response.json();

    return results;
  } catch (error) {
    console.error("Deu ruim: ", error.message);
  }
}

const [song1, song2, song3, song4, song5] = await getTopFiveSongs();

console.log("Song 1:", song1);
console.log("Song 2:", song2);
console.log("Song 3:", song3);
console.log("Song 4:", song4);
console.log("Song 5:", song5);
