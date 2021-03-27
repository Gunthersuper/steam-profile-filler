# steam-profile-filler
Automatic Steam profile filling

This is a node js script based on [https://github.com/DoctorMcKay/node-steamcommunity](node-steamcommunity) that automatic add name, real name, country, summary, avatar, and change the privacy settings to public. This bot works with limited and unlimited steam accounts both.

### Installing:
1. Download the latest stabe version of Node JS - [nodejs.org](nodejs.org)
2. Download and unpack the archive to any location
3. Open PowerShell or command prompt (or terminal for Linux) in the folder with the bot. To do this enter: `cd c:\path_to_the_folder` or if you use Windows go to the needed folder in the explorer, then press `SHIFT + right mouse`, select: `Open PowerShell window here`
4. Enter in the console: `npm i` or `npm install`

### Configuration:
1. Textfiles `names.txt`, `realnames.txt`, `summary.txt` contain many lines, bot will take a random line from these files for each account.
2. `bot.txt`. Here you put your bots in each line: `username:password:shared_secret`.
3. `avatars` folder contains images that bot will take a random of them. You can get more avatars from here - [https://randomavatar.com/](https://randomavatar.com/).
4. 'config.json' contain only one parameter - `delay`. This is delay time between authorizations. More time - more safe.

### Using:
1. In the console type: `node index` or `node index.js`
2. Wait when the process is complete. The bot changes accounts information one by one.
