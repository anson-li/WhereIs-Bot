const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("WhereIs-Bot initialized.");
});

client.on("message", (message) => {
  if (!(message.content.startsWith("!Where") || message.content.startsWith("!Found")) || message.author.bot) return;
  if (message.content.startsWith("!Where")) {
    var commandText = message.content.replace('!Where', '').trim();
    var queryText = encodeURI(commandText);
    var googleMapsProcessedLink = 'https://www.google.com/maps/search/?api=1&query=' + queryText;
    var googleMapsImageLink = 'https://maps.googleapis.com/maps/api/staticmap?center=' + queryText + '&format=jpg&zoom=15&size=300x150&key=AIzaSyDts1BBErQx4zGFyXghy0igA1y8JbOJ7c4'
    const embed = new Discord.RichEmbed()
      .setTitle("Directions to " + commandText)
      .setColor(0x00AE86)
      .setURL(googleMapsProcessedLink)
      .setTimestamp()
      .setImage(googleMapsImageLink);
    message.channel.send({embed});
  }
});

// google maps api key: AIzaSyDts1BBErQx4zGFyXghy0igA1y8JbOJ7c4

client.login("NDMyNzA4NjYyMzAyMjEyMTA2.DaxQAw.HEYt5ejAjdVL7Lwo2eHSZR7vLYk");

// https://maps.googleapis.com/maps/api/directions/json?origin=Torontodestination=Montreal&avoid=highways&mode=bicycling&key=AIzaSyDts1BBErQx4zGFyXghy0igA1y8JbOJ7c4
// https://www.google.com/maps/search/?api=1&query=centurylink+field

