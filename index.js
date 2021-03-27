const SteamCommunity = require('steamcommunity');
const SteamTotp = require('steam-totp');
const Colors = require('colors');
const path = require('path');
var Async = require('async');
var fs = require('fs');
var request = require('request')

var community = new SteamCommunity;

// Import botx.txt file with your account list (username:password:shared_secret):
var text = fs.readFileSync('./bots.txt').toString('utf-8');
var bot = text.split('\n')

// Import list of names:
var text2 = fs.readFileSync('./names.txt').toString('utf-8');
var names = text2.split('\n')

// Import list of real names:
var text3 = fs.readFileSync('./realnames.txt').toString('utf-8');
var realnames = text3.split('\n')

// Import list of summary information (bio):
var text4 = fs.readFileSync('./summary.txt').toString('utf-8');
var bios = text4.split('\n')

// List of country codes:
const countries = ['US', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CZ', 'CY', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EG', 'ES', 'ET', 'FI', 'FJ', 'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GM', 'GN', 'GW', 'GY', 'GR', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IT', 'KZ', 'RU', 'LV', 'PH', 'TD', 'SO', 'AF', 'VN']

// Import avatars images from the /avatar folder:
var files = fs.readdirSync('./avatars')

// Import the config file (config.json), which contains delay time between authorizations
config = require(path.resolve('config.json'));
let configRaw = fs.readFileSync('./config.json').toString();
const delay = config.delay;


(async() => {
	// loop (the same actions for all accounts from the bots.txt):
	for (let i = 0; i < bot.length; i++) {
		// Lets make a variable with username, password and shared secret. And take this from the bots.txt:
		const logOnOptions = {
			accountName: bot[i].split(":")[0],
			password: bot[i].split(":")[1],
			twoFactorCode: SteamTotp.generateAuthCode(bot[i].split(":")[2]),
		}; 
		// Just try to login with the above account data:
		community.login({
			"accountName": logOnOptions.accountName,
			"password": logOnOptions.password,
			"twoFactorCode": logOnOptions.twoFactorCode,
		},
		function (err, sessionID, cookies, steamguard, oAuthToken) {
			if (err) console.log('[%s] Unable to auth (Error: %s)'.red, logOnOptions.accountName, err); // If cant login it will show this on the console
			if (!err) {	
				// If successfully logged on lets make the following actions:
				(async() => {			
					console.log('-----------------------------\n[%s] Successfully Logged on'.cyan, logOnOptions.accountName);
					// Request for changing privacy settings to public:
					community.profileSettings({
						profile: 3,
						comments: 3,
						inventory: 3,
						inventoryGifts: false,
						playtime: false,
						friendsList: 3
					},  function (err, data) {
						if (err) console.log('[%s] Error when changing the privacy settings'.red, logOnOptions.accountName); 	// If error say about this.				
						if (!err) console.log('[%s] Successfully changed privacy settings'.green, logOnOptions.accountName); 											
					});

					await new Promise(r => setTimeout(r, 3000)); // wait 3 sec before the next action

					var name = names[Math.floor(Math.random() * names.length)];  // Take a random name from the names.txt
					var realname = realnames[Math.floor(Math.random() * realnames.length)];  // Take a random realname from the realnames.txt
					var country = countries[Math.floor(Math.random() * countries.length)];	// Take a random country code from the country list
					var bio = bios[Math.floor(Math.random() * bios.length)];  // Take a random summmary info from the summary.txt
					// Request to change the profile info (name, realname, country, summary):		
					community.editProfile({
						name: name,
						realName: realname,
						summary: bio,
						country: country
					},  function (err, data) {
						if (err) console.log('[%s] Error when changing the profile information'.red, logOnOptions.accountName); 	// If error say about this.				
						if (!err) console.log('[%s] Successfully filled the profile'.green, logOnOptions.accountName); 											
					});


					await new Promise(r => setTimeout(r, 3000)); // wait 3 sec before the next action

					// Take a randowm avatar (jpg image) from the avatar folder:
					avatar = './avatars/' + files[Math.floor(Math.random() * files.length)];

					// And just upload the profile avatar:
					community.uploadAvatar(avatar, function (err, data) {
						if (err) {
								console.log('[%s] Error - %s'.red, logOnOptions.accountName, err); 
								
							}
							if (!err) {
								console.log('[%s] Successfully added img'.green, logOnOptions.accountName);							
							}
					})

				})();
			};
		});
		
		if (i < bot.length) await new Promise(r => setTimeout(r, delay));  // Wait 'delay' ms before logging to the next acc from the bots.txt. 
	
	};

})();