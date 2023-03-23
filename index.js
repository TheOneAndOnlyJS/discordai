const {Client, GatewayIntentBits, REST} = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
const path = require('path')
const fs = require('fs')
require('dotenv').config();

const channelID = process.env.CHANNEL_ID

const client = new Client({ intents : 
    [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
    ]
})

const openAI = new OpenAIApi(new Configuration ({
    apiKey: process.env.OPENAI_API_KEY
}));


const rest = new REST({ version: 10}).setToken(process.env.BOT_TOKEN)

/*async function main() {
    const commands = [
        {
            name: "helpai",
            description: "An AI to help you in your needs",
            options: [{
                name: "prompt",
                description: "An AI to help you in your needs",
                type: 3,
                required: true
            }]
        },
    ]
    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
    }
}
main();*/


client.on('messageCreate', async (message) => {
    try{
        if(message.author.bot){
            return;
        }
        if(message.content.toLowerCase().startsWith('/testai')) {
            const AIResponse = await openAI.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: message.content}]
            })
            message.reply(AIResponse.data.choices[0].message.content)
        }
        else if(message.content === '/help_testai'){
            fs.readFile(path.join(__dirname, 'help.txt'), 'utf8', (err, data) => {
                if(err){
                    console.log(err)
                }
                else{
                    message.reply(data)
                }
            })
        }
        else{
            return;
        }
        return
    }
    catch(err){
        console.log(err)
    }
});
  

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`)
})

client.login(process.env.BOT_TOKEN)
