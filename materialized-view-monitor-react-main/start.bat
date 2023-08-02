:: the service was created by nssm to use this file when the service is started

:: cd into the directory this file is in
cd /d %~dp0

:: call npm start
:: this means we can add commands to the npm start script in package.json such as nvm use, etc.
npm start