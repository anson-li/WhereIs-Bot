const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");

const discordkey = 'NDMyNzA4NjYyMzAyMjEyMTA2.DaxQAw.HEYt5ejAjdVL7Lwo2eHSZR7vLYk'
const googleMapsAPIKey = 'AIzaSyDts1BBErQx4zGFyXghy0igA1y8JbOJ7c4'

sql.open("./locations.sqlite");

client.on("ready", () => {
  console.log('WhereIs-Bot initialized.');
});

client.on("message", (message) => {
  if (!(message.content.startsWith("!Where") || message.content.startsWith("!Found")) || message.author.bot) return;
  
  // !Found: allows users to save custom locations. Useful for difficult or confusing Pokestop locations.
  if (message.content.startsWith("!Found")) {
    // Prevents people from mucking up the DB via DM's.
    if (message.channel.type === "dm") return;
    var commandText = message.content.replace('!Found', '').trim();
    var locationName = commandText.split('"')[1];
    var locationDir = commandText.split('"')[3];
    sql.get(`SELECT * FROM locations WHERE name ="${locationName}"`).then(row => {
      if (!row) {
        sql.run(`INSERT INTO locations (name, location) VALUES (?, ?)`, [locationName, locationDir]);
      } else {
        sql.run(`UPDATE location SET location = ${locationDir} WHERE name = ${locationName}`);
      }
    });
    message.reply(`Successfully updated location '${locationName}' with '${locationDir}'`);
  }

  // !Where: allows users to generate a direct Google Maps link using a string
  if (message.content.startsWith("!Where")) {
    var commandText = message.content.replace('!Where', '').trim();
    sql.get(`SELECT location FROM locations WHERE name ="${commandText}"`).then(row => {
      if (row) {
        message.reply(`Found ${commandText} as ${row.location}`);
        generateEmbed(message, row.location);
      } else {
        generateEmbed(message, commandText);
      }
    });
  }
});

// Generates the embedded message containing the Google Maps link, as well as an image.
function generateEmbed(message, commandText) {
  var queryText = encodeURI(commandText);
  var googleMapsProcessedLink = 'https://www.google.com/maps/search/?api=1&query=' + queryText;
  var googleMapsImageLink = 'https://maps.googleapis.com/maps/api/staticmap?center=' + queryText + '&format=jpg&zoom=15&size=300x150&key=' + googleMapsAPIKey;
  const embed = new Discord.RichEmbed()
    .setTitle("Directions to " + commandText)
    .setColor(0x00AE86)
    .setURL(googleMapsProcessedLink)
    .setTimestamp()
    .setImage(googleMapsImageLink);
  message.channel.send({embed});
}

client.login(discordkey);
