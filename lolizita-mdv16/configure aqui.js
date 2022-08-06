const fs = require('fs');

module.exports = {
	prefix: "/",
	owner: ["5522998685899@s.whatsapp.net"],
	compreSuaApikey: "semApikeyRegistrada",
	api: "https://ayanami-apis.herokuapp.com",
	logo: fs.readFileSync("./base de dados/fotos/logo.jpg")
}

/**
Se for mudar algo
só mude o owner
prefix e compreSuaApikey.
*/