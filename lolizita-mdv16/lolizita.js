const { default: makeWASocket, WAProto, mentionedJid, Mimetype, MessageType, downloadMediaMessage } = require("@adiwajshing/baileys");
/* Bom, eu tive muito trabalho pra fazer esse bot
porem, quero pedir que não espalhe esse bot.
Alem de vc comprar ele por 30/60 Vc vai explanar?

--[ Por favor, não explane o bot! ]--
*/

// Módulos.
const fs = require('fs');
const util = require('util');
const axios = require('axios');
const chalk = require('chalk');
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment-timezone');
const speed = require('performance-now');
const execute = util.promisify(require('child_process').exec);
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const request = require('request');
const yts = require('yt-search');
 
// Arquivos js
const { spawn, exec } = require("child_process");
const { yt, yta, ytv } = require('./base de dados/lib/ytmate2');
const { color } = require('./base de dados/lib/color');
const { getGroupAdmins, getRandom, getExtension, getBuffer, fetchJson, sleep, runtime, isUrl, getFileBuffer, readMore, togif } = require('./base de dados/lib/functions');
const { linguagem, mess } = require('./base de dados/database/menu');
const { prefix, owner, compreSuaApikey, api, logo } = require('./configure aqui.js');
const { isFiltered, addFilter } = require('./base de dados/lib/antiflood.js');

// Arquivos json
const antilink = JSON.parse(fs.readFileSync('./base de dados/FilesJson/antilink.json'));
const welcome = JSON.parse(fs.readFileSync('./base de dados/FilesJson/welcome.json'));
const antifake = JSON.parse(fs.readFileSync('./base de dados/FilesJson/antifake.json'));
const antiViewOnce = JSON.parse(fs.readFileSync('./base de dados/FilesJson/antiViewOnce.json'));
const antiListaNegra = JSON.parse(fs.readFileSync('./base de dados/FilesJson/listaNegra.json'));
const addBanJson = JSON.parse(fs.readFileSync('./base de dados/FilesJson/addBan.json'));
const listGroup = JSON.parse(fs.readFileSync('./base de dados/FilesJson/listGroup.json'));
const _pushNames = JSON.parse(fs.readFileSync('./base de dados/FilesJson/pushname.json'));
const _messageCount = JSON.parse(fs.readFileSync('./base de dados/FilesJson/messages.json'));
const addGroupHours = JSON.parse(fs.readFileSync('./base de dados/FilesJson/groupIdHours.json'));

module.exports = lolizita = async (lolizita, mek, store, welcome, antifake, antiListaNegra, _messageCount) => {
try {
if (!mek.message) return;
if (mek.key.fromMe) return;
if (mek.key && mek.key.remoteJid == 'status@broadcast') return;

const fromMe = mek.key.fromMe;
const content = JSON.stringify(mek.message);
const from = mek.key.remoteJid;
const type = Object.keys(mek.message).find((key) => !['senderKeyDistributionMessage', 'messageContextInfo'].includes(key));

//read messages and presence
await lolizita.sendPresenceUpdate('available', from);
await lolizita.sendReadReceipt(from, mek.key.participant, [mek.key.id]);

const budy = (type === 'conversation') ? mek.message.conversation: (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text: ''
const body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation: (type == 'imageMessage') && mek.message[type].caption.startsWith(prefix) ? mek.message[type].caption: (type == 'videoMessage') && mek.message[type].caption.startsWith(prefix) ? mek.message[type].caption: (type == 'extendedTextMessage') && mek.message[type].text.startsWith(prefix) ? mek.message[type].text: (type == 'listResponseMessage') && mek.message[type].singleSelectReply.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId: (type == 'templateButtonReplyMessage') ? mek.message.templateButtonReplyMessage.selectedId: (type === 'messageContextInfo') ? mek.message[type].singleSelectReply.selectedRowId: (type == 'lolizita.sendMessageButtonMessage') && mek.message[type].selectedButtonId ? mek.message[type].selectedButtonId: (type == 'stickerMessage') && ((mek.message[type].fileSha256.toString('base64')) !== null && (mek.message[type].fileSha256.toString('base64')) !== undefined) ? (mek.message[type].fileSha256.toString('base64')): "" || mek.message[type]?.selectedButtonId || ""

const comando = body.slice(1).trim().split(/ +/).shift().toLowerCase();
const isCmd = body.startsWith(prefix);
const args = body.trim().split(/ +/).slice(1);
const text = args.join(' ');

// Numero do bot
const me = lolizita.user;
const nameBot = lolizita.user.name || "Not found";
const botNumber = lolizita.user.id.split(':')[0] + '@s.whatsapp.net';

// Grupos
const isGroup = mek.key.remoteJid.endsWith('@g.us');
const sender = isGroup ? (mek.key.participant ? mek.key.participant: mek.participant): mek.key.remoteJid
const groupMetadata = isGroup ? await lolizita.groupMetadata(from): ''
const groupId = isGroup ? groupMetadata.id: prefix + ''
const groupOwner = isGroup ? groupMetadata.owner: ''
const groupDesc = isGroup ? groupMetadata.desc: ''
const groupName = isGroup ? groupMetadata.subject: ''
const groupMembers = isGroup ? groupMetadata.participants: []
const participants = isGroup ? await groupMetadata.participants: ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id): ''
const isGroupAdmins = isGroup ? groupAdmins.includes(sender): false
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false

// Owner: dono
const isOwner = owner.includes(sender)
const nameOwner =  _pushNames.find(v => v.id === owner[0])?.pushName;

// Pushname: nome
const conts = mek.key.fromMe
const pushname = nome = mek.pushName ? mek.pushName: "-"

// Funções get
const getPushName = (id) => _pushNames.find((obj) => obj.id === id)?.pushName;
const getRecado = (id) => lolizita.fetchStatus(id);
const getMessagePrivado = (userId) => _messageCount.users.find(obj => obj.id === userId)?.total || 0;
const getTotalMessageGroup = (userId, groupId) => _messageCount.groups.find(obj => obj.groupId === groupId)?.users[userId] || 0;
const membersId = groupMembers.map(({id}) => id);
const ghosts = membersId.filter(id => !getTotalMessageGroup(id, from) && botNumber !== id);

// Horas
const hr = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
const timestamp = speed();
const latensi = speed() - timestamp;

// Menu
const enter = "\n";
const totalGrupos = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id);
const totalChatId = await store.chats.all().filter(v => v.id.endsWith('@g.us') || v.id.endsWith('@s.whatsapp.net')).map((b) => b.id);
const totalChats = await store.chats.all();

// Antis
const isWelcome = isGroup ? welcome.includes(from): true
const isAntiLink = isGroup ? antilink.includes(from): true
const isViewOnce = isGroup ? antiViewOnce.includes(from): true
const isAntiFake = isGroup ? antifake.includes(from): true
const isListaNegra = isGroup ? antiListaNegra.includes(from) : true;
const islistGroup = isGroup ? listGroup.includes(from) : false;
const isBanned = isGroup ? addBanJson.includes(sender) : false;

// Enviar Mensagem
const enviar = (content, type, options = {}) => {
const isFullUrl = (url) => new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/, 'gi').test(url);
const mediaKeys = ['image', 'video', 'sticker', 'audio', 'document', 'history', 'md-app-state'];
options[type || 'text'] = isFullUrl(content) && mediaKeys.includes(type) ? { url: content } : content;
return lolizita.sendMessage(from, options, { quoted: mek});
};

// Enviar mensagens em JSON.stringify
const reply = (caption) => {
return lolizita.sendMessage(from, {text: JSON.stringify(caption, null, 2)}, {quoted: mek});
}

// Mencionador
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? lolizita.sendMessage(from, {
text: teks.trim(), mentions: memberr}, {quoted: mek}): lolizita.sendMessage(from, {
text: teks.trim(), mentions: [memberr]}, {
quoted: mek
});
};

//TIPOS DE MENSAGENS
const isVideo = (type == 'videoMessage')
const isImage = (type == 'imageMessage')
const isSticker = (type == 'stickerMessage')
const isLocLive = (type === 'liveLocationMessage')
const isContato = (type === 'contactMessage')
const isCatalogo = (type === 'productMessage')
const isLocalização = (type === 'locationMessage')
const isDocumento = (type === 'documentMessage')
const iscontactsArray = (type === 'contactsArrayMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true: false: false
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true: false: false
const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true: false: false
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true: false: false
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true: false: false
const tipoMensagem = type == 'audioMessage' ? 'Audio': type == 'stickerMessage' ? 'Sticker': type == 'imageMessage' ? 'Imagem': type == 'videoMessage' ? 'Video': type == 'documentMessage' ? 'Documento': type == 'contactMessage' ? 'Contato': type == 'locationMessage' ? 'Localização': 'Mensagem'
if (!isGroup && isCmd && !isSticker) console.log('\x1b[1;31m', color("➛ ", "red"), color("〘 ", "red"), color("Comando"), color(" 〙", "red"), color("\nNome:"), color(pushname, "red"), color("\nHoras:"), color(hr, "red"), color("\nComando:"), color(comando, "red"))
if (isCmd && isGroup) console.log('\x1b[1;31m', color("➛ ", "red"), color("〘 ", "red"), color("Comando"), color(" 〙", "red"), color("\nNome:"), color(pushname, "red"), color("\nHoras:"), color(hr, "red"), color("\nComando:"), color(comando, "red"), color("\nGrupo:"), color(groupName + "\n", "red"))
if (!isCmd && isGroup) console.log('\x1b[1;31m', color("➛ ", "red"), color("〘 ", "red"), color("Mensagem"), color(" 〙", "red"), color("\nNome:"), color(pushname, "red"), color("\nHoras:"), color(hr, "red"), color("\nTipo:"), color(tipoMensagem, "red"), color("\nGrupo:"), color(groupName + "\n", "red"))
if (!isGroup && !isCmd) console.log('\x1b[1;31m', color("➛ ", "red"), color("〘 ", "red"), color("Mensagem"), color(" 〙", "red"), color("\nNome:"), color(pushname, "red"), color("\nHoras:"), color(hr, "red"), color("\nTipo:"), color(tipoMensagem + "\n", "red"))

// Teste - Ainda vou mexer
const sendButMessage = async(from, teext, footer, button = [], options = {}) => {
list = WAProto.Message.fromObject({
buttonsMessage: WAProto.ButtonsMessage.fromObject({
contentText: teext, footerText: footer, buttons: button, headerType: 1
})})
lolizita.relayMessage(from, list, {
messageId: mek.key.id
})
}

// Teste - Ainda vou mexer
const sendEnviar = async(id, first, second, third, bedroom) => {
sendButMessage(id, first, second, [{
buttonId: bedroom, buttonText: {
displayText: third
}, type: 1
}])
}

// Anti visualização única
const isViewOnceMessage = type == 'viewOnceMessage' ? Object.keys(mek.message.viewOnceMessage.message)[0] : '';
if (antiViewOnce.indexOf(from) !== -1) {
switch (isViewOnceMessage) {
case 'imageMessage':
var viewOnce = mek.message.viewOnceMessage.message.imageMessage;
viewOnce.viewOnce = false;
viewOnce.contextInfo = {
isForwarded: true,
forwardingScore: 1
}
lolizita.relayMessage(from, {
imageMessage: viewOnce
}, {
messageid: prefix + 'BAE5' + require('crypto').randomBytes(6).toString('hex').toUpperCase(), additionalAttributes: {}});
enviar('viewOnce detectado');
break;

case 'videoMessage':
var viewOnce = mek.message.viewOnceMessage.message.videoMessage;
viewOnce.viewOnce = false;
viewOnce.contextInfo = {
isForwarded: true,
forwardingScore: 1
}
lolizita.relayMessage(from, {
videoMessage: viewOnce
}, {
messageid: prefix + 'BAE5' + require('crypto').randomBytes(6).toString('hex').toUpperCase(), additionalAttributes: {}});
enviar('viewOnce detectado');
break;
}
}

// Download de sticker
async function sendStickerFromUrl(id, url) {
var names = Date.now() / 10000;
var download = function (uri, filename, callback) {
request.head(uri, function (err, res, body) {
request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
});
};
download(url, './sticker' + names + '.png', async function () {
let filess = './sticker' + names + '.png'
let asw = './sticker' + names + '.webp'
exec(`ffmpeg -i ${filess} -vf "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=60, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" ${asw}`, (err) => {
let media = fs.readFileSync(asw)
lolizita.sendMessage(id, {sticker: media}, {quoted: mek})
fs.unlinkSync(filess)
fs.unlinkSync(asw)
});
});
}

// Anti links
if (isUrl(budy) && isAntiLink && isGroupAdmins && isBotGroupAdmins) {
if (budy.match(await lolizita.groupInviteCode(from))) return enviar('Link do Grupo, não irei remover..')
enviar('*Link detectado, porém usuário é admin*')
}

// Anti links
if (isUrl(budy) && isAntiLink && !isGroupAdmins && isBotGroupAdmins) {
enviar('*Link detectado, punindo usuário...*')
lolizita.groupParticipantsUpdate(from, [sender], "remove")
}

const savePushName = (id, pushName) => {
const positionId = _pushNames.indexOf(_pushNames.find((obj) => obj.id === id));
if (positionId === -1) {
_pushNames.push({id, pushName});
} else {
if (_pushNames[positionId].pushName === pushName) return;
_pushNames[positionId].pushName = pushName;
};
fs.writeFileSync('./base de dados/FilesJson/pushname.json', JSON.stringify(_pushNames, null, 4));
};

savePushName(sender, mek.pushName);

const addMessage = (userId, groupId, isGroup) => {
userId = userId.replace(/:\d*?(?=@)/g, '');
if (isGroup) {
const positionGp = _messageCount.groups.findIndex((obj) => obj.groupId === groupId);
if (positionGp === -1) {
_messageCount.groups.push({groupId: groupId, total: 1, users: {[userId]: 1}});
} else {
_messageCount.groups[positionGp].total++;
_messageCount.groups[positionGp].users[userId] = (_messageCount.groups[positionGp].users[userId] || 0) + 1;
};
} else {
const positionGp = _messageCount.users.findIndex((obj) => obj.id === userId);
if (positionGp === -1) {
_messageCount.users.push({id: userId, total: 1});
} else {
_messageCount.users[positionGp].total++;
};
};
fs.writeFileSync('./base de dados/FilesJson/messages.json', JSON.stringify(_messageCount, null, 4)); //ALTERA O PATH
};

addMessage(sender, from, isGroup);

if (isBanned && isCmd && !isOwner) return enviar(mess.banned());
if (islistGroup && isCmd && !isOwner) return;

/*
if (isCmd && isFiltered(from) && !isGroup && !isOwner) {
console.log(color('SPAM', 'red'), color(moment.tz('America/Sao_Paulo').format('HH:mm:ss'), 'yellow'), color(comando), 'DE:', color(pushname))
return lolizita.sendMessage(from, {text: `Oooppsss!! Flood de comandos detectado, Espere 20 segundos.`}, {quoted: mek});
};

if (isCmd && isFiltered(from) && isGroup && !isOwner) {
console.log(color('SPAM', 'red'), color(moment.tz('America/Sao_Paulo').format('HH:mm:ss'), 'yellow'), color(comando), 'DE:', color(pushname))
return lolizita.sendMessage(from, {text: `Oooppsss!! Flood de comandos detectado, Espere 20 segundos.`}, {quoted: mek});
};
*/

switch (comando) {
// MENUS
case 'list': case 'menu': case 'help': case '?':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.menu(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Grupo〙🌟`, id: prefix + 'grupo'}}]);
break

case 'grupo':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.grupo(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Logos〙🌟`, id: prefix + 'logos'}}]);
break

case 'perfil': case 'user':
//@Tobi
addFilter(from);
try {
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
try {
ppuser = await lolizita.profilePictureUrl(al_id, 'image')
} catch {
ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
lolizita.sendMessageButton1(from, await mess.getPerfil(getPushName, getRecado, getMessagePrivado, getTotalMessageGroup, from, al_id), nameBot, {image: {url : ppuser}}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}]);
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
try {
ppuser = await lolizita.profilePictureUrl(al_id, 'image')
} catch {
ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
lolizita.sendMessageButton1(from, await mess.getPerfil(getPushName, getRecado, getMessagePrivado, getTotalMessageGroup, from, al_id), nameBot, {image: {url : ppuser}}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}]);
}
} catch (e) {
console.log("Error : %s", color(e, "red"));
if (String(e) === "TypeError: Cannot read properties of null (reading 'contextInfo')") {
try {
ppuser = await lolizita.profilePictureUrl(sender, 'image')
} catch {
ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
}
lolizita.sendMessageButton1(from, await mess.getPerfil(getPushName, getRecado, getMessagePrivado, getTotalMessageGroup, from, sender), nameBot, {image: {url : ppuser}}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}]);
}
}
break;

case 'logos':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.logos(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Jogos〙🌟`, id: prefix + 'jogos'}}]);
break

case 'jogos':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.jogos(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Criador〙🌟`, id: prefix + 'criador'}}]);
break

case 'criador':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.criador(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Animes〙🌟`, id: prefix + 'animes'}}]);
break

case 'animes':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.animes(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Download〙🌟`, id: prefix + 'download'}}]);
break

case 'download':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.download(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Consultas〙🌟`, id: prefix + 'consultas'}}]);
break

case 'consultas':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.consultas(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Figurinhas〙🌟`, id: prefix + 'figurinhas'}}]);
break

case 'figurinhas':
//@Tobi
addFilter(from);
lolizita.sendMessageButton1(from, linguagem.figurinhas(prefix, hr, me), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}, {quickReplyButton: {displayText: `🌟〘Next: Grupo〙🌟`, id: prefix + 'grupo'}}]);
break

case 'status':
//@Tobi
addFilter(from);
lolizita.sendMessageButton(from, {image: logo}, mess.ping(latensi, totalGrupos, totalChats, process, runtime, owner));
break

// COMANDOS DOWNLOAD
case 'play':
case 'tocar':
case 'toca':
case 'musica':
//@Tobi
addFilter(from);
teks = args.join(' ');
if (!teks) return enviar(mess.textSyntax());
enviar("⏳ Baixando sua música, espere!");
yts(teks).then(async value => {
const allTypeVid = value.all.find((obj) => obj.type === 'video');
yta(allTypeVid.url).then(async position => {
lolizita.sendMessage(from, {
audio: {
url: position.dl_link
}, contextInfo: {
"externalAdReply": {
"title": `Música: ${position.title}\n`, "body": `Duração: ${allTypeVid.duration.timestamp}`, "mediaType": 2, showAdAttribution: true, "thumbnail": await getBuffer(allTypeVid.image), mediaUrl: allTypeVid.url
}}, mimetype: 'audio/mp4'
}, {
quoted: mek
});
}, (err) => {
enviar(mess.commandError(err)); console.log("Error : %s", color(err, "red"));
});
}, (err) => {
enviar(mess.commandError(err)); console.log("Error : %s", color(err, "red"));
});
break;

case 'pvideo':
case 'playvid':
case 'playvideo':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.textSyntax());
await enviar("⏳ Baixando seu video! espere um momento...");
yts(text).then((a) => {
const typeId = a.all.filter((b) => b.type === 'video');
ytv(typeId[0].url).then((c) => {
lolizita.sendMessage(from, {video: {url: c.dl_link}, mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError(err));
console.log("Error : %s", color(err, "red"));
});
}).catch((err) => {
enviar(mess.commandError(err));
console.log("Error : %s", color(err, "red"));
});
break;

case 'ytmp3':
//@Tobi
addFilter(from); 
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://youtu.be/") && budy.startsWith("https://youtube.com/")) return enviar(mess.textNotAllowed());
enviar("⏳ Baixando sua música, espere!");
await yta(text).then((anu) => {
lolizita.sendMessage(from, {audio: {url: anu.dl_link}, mimetype: 'audio/mp4'}, {quoted:mek});
}).catch((err) => {
enviar(String(err) === "TypeError: Cannot read properties of undefined (reading 'title')" ? "Ops... Conteúdo não foi encontrado." : String(err) === "FetchError: invalid json response body at https://www.y2mate.com/mates/en154/analyze/ajax reason: Unexpected token < in JSON at position 0" ? "Erro! Conteúdo disponível só no youtube." : mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'ytmp4':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://youtu.be/") && budy.startsWith("https://youtube.com/")) return enviar(mess.textNotAllowed());
enviar("⏳ Baixando seu vídeo, espere!");
ytv(text).then((anu) => {
lolizita.sendMessage(from, {video: {url: anu.dl_link}, mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(String(err) === "TypeError: Cannot read properties of undefined (reading 'title')" ? "Ops... Conteúdo não foi encontrado." : String(err) === "FetchError: invalid json response body at https://www.y2mate.com/mates/en154/analyze/ajax reason: Unexpected token < in JSON at position 0" ? "Erro! Conteúdo disponível só no youtube." : mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'tiktok':
//@Tobi
addFilter(from); 
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://vm.tiktok.com/")) return enviar(mess.textNotAllowed());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/tiktod/?url=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {video: {url: anu.resultado.semMarcaDeAgua}, mimetype: 'video/mp4'}, {quoted: mek});
lolizita.sendMessage(from, {video: {url: anu.resultado.comMarcaDeAgua}, mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'xnxxplay':
//@Tobi
addFilter(from); 
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://www.xnxx.com/")) return enviar(mess.textNotAllowed());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/xnxx/?link=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {video: {url: anu.resultado.link}, mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

case 'xvideosplay':
//@Tobi
addFilter(from); 
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://www.xvideos.com/")) return enviar(mess.textNotAllowed());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/xvideos?link=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {video: {url: anu.resultado.link}, mimetype: 'video/mp4'}, {quoted: mek, thumbnail: null});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

case 'hentaistube':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://www.hentaistube.com/")) return enviar(mess.textNotAllowed());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/hentai?link=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {video: {url: anu.resultado.video}, mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

case 'mediafire':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://www.mediafire.com/")) return enviar(mess.textNotAllowed());
enviar('⏳ Baixando arquivo.. Espere!');
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/mediafire/?link=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {document: {url: anu.resultado[0].link}, mimetype: anu.resultado[0].tipo, fileName: anu.resultado[0].nome}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

case 'twitter':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.linkSyntax());
if (!args[0].startsWith("https://twitter.com/")) return enviar(mess.textNotAllowed());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/download/twitter/?link=${args.join(' ')}&apikey=` + compreSuaApikey).then(anu => {
lolizita.sendMessage(from, {image: {url: anu.resultado.thumb}, caption: anu.resultado.desc}, {quoted: mek});
lolizita.sendMessage(from, {video: {url: anu.resultado.HD}, caption: "Vídeo em HD", mimetype: 'video/mp4'}, {quoted: mek});
lolizita.sendMessage(from, {video: {url: anu.resultado.SD}, caption: "Vídeo em SD", mimetype: 'video/mp4'}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

case 'live':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar("❌ Pesquise títulos de live do youtube.");
await enviar("✔️ Espere... Pesquisando live no youtube.");
await yts(text).then((anu) => {
teks = `No momento existe ${anu.live.length} lives online.\n\n`
for (let m of anu.live) {
teks += `➡️ Tipo: *${m.type}*
✅ Nome: *${m.title}*
✅ Link: *${m.url}*
✅ Autor: *${m.author.name}*
✅ Canal: *${m.author.url}*
✅ Descrição: *${m.description}*\n`;
}
lolizita.sendMessage(from, {image: {url: anu.live[0].image}, caption: teks}, {quoted: mek});
}).catch((err) => {
console.log("Err: %s", color(err, "red"));
enviar(err == "TypeError: Cannot read properties of undefined (reading 'image')" ? "No momento não existe live ao vivo.": err)
});
break;

case 'hidetag':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.length < 1) return enviar(mess.textSyntax());
lolizita.sendMessage(from, {text: args.join(' '), mentions: groupMembers.map(a => a.id)})
break

case 'banir':
case 'kick':
case 'ban':
case 'rem':
case 'k':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso banir meu dono.");
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
lolizita.groupParticipantsUpdate(from, [al_id], "remove");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso banir meu dono.");
lolizita.groupParticipantsUpdate(from, [al_id], "remove");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'add':
case 'reviver':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins && !isOwner) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
lolizita.groupParticipantsUpdate(from, [al_id], "add");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
lolizita.groupParticipantsUpdate(from, [al_id], "add");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'promote':
case 'promover':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins && !isOwner) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
lolizita.groupParticipantsUpdate(from, [al_id], "promote");
mentions(`✔️ Sucesso! Membro: @${al_id.split('@')[0]} promovido.`, [al_id], true);
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
lolizita.groupParticipantsUpdate(from, [al_id], "promote");
mentions(`✔️ Sucesso! Membro: @${al_id.split('@')[0]} promovido.`, [al_id], true);
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'demote':
case 'rebaixa':
case 'rebaixar':
case 'despromover':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins && !isOwner) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
lolizita.groupParticipantsUpdate(from, [al_id], "demote");
mentions(`✔️ Sucesso! Membro: @${al_id.split('@')[0]} rebaixado.`, [al_id], true);
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
lolizita.groupParticipantsUpdate(from, [al_id], "demote");
mentions(`✔️ Sucesso! Membro: @${al_id.split('@')[0]} rebaixado.`, [al_id], true);
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'addlistanegra':
case 'addlistnegra':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins && !isOwner) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (antiListaNegra.find(value => value.group === from && value.numbers.includes(al_id))) return enviar("❌ Erro! Esse membro já foi registrado na database.");
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
let existGp = antiListaNegra.find(value => value.group === from)
if (existGp) {
let pos = antiListaNegra.indexOf(existGp)
antiListaNegra[pos].numbers.push(al_id)
} else {
antiListaNegra.push({
group: from, numbers: [al_id]})
}
fs.writeFileSync('./base de dados/FilesJson/listaNegra.json', JSON.stringify(antiListaNegra, null, 2) + '\n')
enviar("✔️ Membro adicionado com sucesso na lista negra.");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
if (antiListaNegra.find(value => value.group === from && value.numbers.includes(al_id))) return enviar("❌ Erro! Esse membro já foi registrado na database.");
let existGp = antiListaNegra.find(value => value.group === from)
if (existGp) {
let pos = antiListaNegra.indexOf(existGp)
antiListaNegra[pos].numbers.push(al_id)
} else {
antiListaNegra.push({
group: from, numbers: [al_id]})
}
fs.writeFileSync('./base de dados/FilesJson/listaNegra.json', JSON.stringify(antiListaNegra, null, 2) + '\n')
enviar("✔️ Membro adicionado com sucesso na lista negra.");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'remlistanegra':
case 'remlistnegra':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins && !isOwner) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
let position = antiListaNegra.indexOf(antiListaNegra.find(value => value.group === from && value.numbers.includes(al_id)))
if (position === -1) return enviar("✔️ Esse membro já foi removido da lista negra.");
antiListaNegra[position].numbers.splice(antiListaNegra[position].numbers.indexOf(al_id), 1)
if (!antiListaNegra[position].numbers.length) antiListaNegra.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/listaNegra.json', JSON.stringify(antiListaNegra))
enviar("❌ Membro removido com sucesso da lista negra.");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
let position = antiListaNegra.indexOf(antiListaNegra.find(value => value.group === from && value.numbers.includes(al_id)))
if (position === -1) return enviar("✔️ Esse membro já foi removido da lista negra.");
antiListaNegra[position].numbers.splice(antiListaNegra[position].numbers.indexOf(al_id), 1)
if (!antiListaNegra[position].numbers.length) antiListaNegra.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/listaNegra.json', JSON.stringify(antiListaNegra))
enviar("❌ Membro removido com sucesso da lista negra.");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'setdesc': 
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.join(' ').length > 500) return enviar(mess.limit());
await lolizita.groupUpdateDescription(from, args.join(' '))
break

case 'setnome':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.join(' ').length > 25) return enviar(mess.limit());
await lolizita.groupUpdateSubject(from, args.join(' '));
break

case 'fechar':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
await lolizita.groupSettingUpdate(from, 'announcement')
break

case 'abrir':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
lolizita.groupSettingUpdate(from, 'not_announcement')
break

case 'group':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args[0] === "abrir") {
lolizita.groupSettingUpdate(from, 'not_announcement')
} else if (args[0] === "fechar") {
lolizita.groupSettingUpdate(from, 'announcement')
} else {
lolizita.sendMessageButton1(from, "Aperte nas duas opções abaixo.", nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `Abrir grupo?`, id: prefix + 'abrir'}}, {quickReplyButton: {displayText: `Fechar grupo?`, id: prefix + 'fechar'}}]);
}
break

case 'listadm':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
teks = `Lista de administradores do grupo: ${groupMetadata.subject}\nTotal: ${groupAdmins.length}\n\n`
no = 0
for (let admon of groupAdmins) {
no += 1
teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
}
mentions(teks, groupAdmins, true)
break

case 'link':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
enviar(`Link: https://chat.whatsapp.com/${await lolizita.groupInviteCode(from)}`)
break

case 'antilink':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.length < 1) return enviar(mess.notiferr(prefix, comando));
if (args[0] === 'on') {
if (isAntiLink) return enviar(mess.activecommand(comando));
antilink.push(from)
fs.writeFileSync('./base de dados/FilesJson/antilink.json', JSON.stringify(antilink))
lolizita.templateMessage(from, mess.functionOn(comando), [{rows: [{title: `Ligar ${comando}?`, rowId: `${comando} on`}, {title: `Desligar ${comando}?`, rowId: `${comando} off`}]}], {quoted: mek});
} else if (args[0] === 'off') {
let position = antilink.indexOf(antilink.find((x) => x === from))
if (position === -1) return enviar(mess.commandDisabled(comando));
antilink.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/antilink.json', JSON.stringify(antilink))
lolizita.templateMessage(from, mess.functionOff(comando), [{rows: [{title: `Ligar ${comando}?`, rowId: `${comando} on`}, {title: `Desligar ${comando}?`, rowId: `${comando} off`}]}], {quoted: mek});
}
break

case 'welcome':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.length < 1) return enviar(mess.notiferr(prefix, comando));
if (args[0] === 'on') {
if (isWelcome) return enviar(mess.activecommand(comando));
welcome.push(from)
fs.writeFileSync('./base de dados/FilesJson/welcome.json', JSON.stringify(welcome))
sendEnviar(from, mess.nameEnter(me), mess.functionOn(comando), `Desativar ${comando} ▶️`, `${comando} off`);
} else if (args[0] === 'off') {
let position = welcome.indexOf(welcome.find((x) => x === from))
if (position === -1) return enviar(mess.commandDisabled(comando));
welcome.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/welcome.json', JSON.stringify(welcome))
sendEnviar(from, mess.nameEnter(me), mess.functionOff(comando), `Ativar ${comando} ▶️`, `${comando} on`);
}
break

case 'antifake':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.length < 1) return enviar(mess.notiferr(prefix, comando));
if (args[0] === 'on') {
if (isAntiFake) return enviar(mess.activecommand(comando));
antifake.push(from)
fs.writeFileSync('./base de dados/FilesJson/antifake.json', JSON.stringify(antifake))
sendEnviar(from, mess.nameEnter(me), mess.functionOn(comando), `Desativar ${comando} ▶️`, `${comando} off`);
} else if (args[0] === 'off') {
let position = antifake.indexOf(antifake.find((x) => x === from))
if (position === -1) return enviar(mess.commandDisabled(comando));
antifake.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/antifake.json', JSON.stringify(antifake))
sendEnviar(from, mess.nameEnter(me), mess.functionOff(comando), `Ativar ${comando} ▶️`, `${comando} on`);
}
break

case 'viewonce':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (args.length < 1) return enviar(mess.notiferr(prefix, comando));
if (args[0] === 'on') {
if (isViewOnce) return enviar(mess.activecommand(comando));
antiViewOnce.push(from)
fs.writeFileSync('./base de dados/FilesJson/antiViewOnce.json', JSON.stringify(antiViewOnce))
sendEnviar(from, mess.nameEnter(me), mess.functionOn(comando), `Desativar ${comando} ▶️`, `${comando} off`);
} else if (args[0] === 'off') {
let position = antiViewOnce.indexOf(antiViewOnce.find((x) => x === from))
if (position === -1) return enviar(mess.commandDisabled(comando));
antiViewOnce.splice(position, 1)
fs.writeFileSync('./base de dados/FilesJson/antiViewOnce.json', JSON.stringify(antiViewOnce))
sendEnviar(from, mess.nameEnter(me), mess.functionOff(comando), `Ativar ${comando} ▶️`, `${comando} on`);
}
break

case 'tagall':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
members_id = []
teks = "";
for (let mem of groupMembers) {
teks += ` ° @${mem.id.split('@')[0]}\n`
members_id.push(mem.id)
}
mentions(teks, members_id, false);
break

// COMANDOS LOGO
case 'natural-leaves':
case 'transformer':
case 'greenhorror':
case 'sciencefiction':
case 'metallic':
case 'magmahot':
case 'thunder':
case 'berry':
case 'embossed':
case 'harrypotter':
case 'impressiveglitch':
case 'neondevilwings':
case 'artpaper':
case 'snow':
case 'futuristicneon':
case 'wonderfulgraffiti':
case 'bearmascot':
case 'luxurygold':
case 'cloud':
case 'sandsummer':
case 'sandwriting':
case 'realisticcloud':
case 'sandengraved':
case '3dglue':
case 'summerysand':
case '1917style':
case 'neonlight':
case 'metaldarkgold':
case 'steeltext':
case 'captainamerica':
case 'chocolate':
case 'toxic':
case 'matrix':
case 'horrorblood':
case '3dbox':
case 'thunder2':
case 'drop-water':
case 'black-pink':
case 'lava':
case 'blood':
case 'xmascards3d':
case '3d-gradient':
case 'christmas':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.textSyntax());
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/textpro/${comando}?apikey=${compreSuaApikey}&text=${args.join(' ')}`).then(anu => {
lolizita.sendMessageButton(from, {image: {url: anu.resultado}}, `✅ Comando: ${comando} || Texto: ${args.join(' ')}`)
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

// COMANDOS JOGOS
case 'slot':
//@Tobi
addFilter(from);
const sotoy = JSON.parse(fs.readFileSync('./base de dados/FilesJson/sotoy.json'))
var somtoy = sotoy[Math.floor(Math.random() * (sotoy.length))]
ppg = Math.floor(Math.random() * 13) + 349
if ((somtoy == '🥑 : 🥑 : 🥑') || (somtoy == '🍉 : 🍉 : 🍉') || (somtoy == '🍓 : 🍓 : 🍓') || (somtoy == '🍎 : 🍎 : 🍎') || (somtoy == '🍍 : 🍍 : 🍍') || (somtoy == '🥝 : 🥝 : 🥝') || (somtoy == '🍑 : 🍑 : 🍑') || (somtoy == '🥥 : 🥥 : 🥥') || (somtoy == '🍋 : 🍋 : 🍋') || (somtoy == '🍐 : 🍐 : 🍐') || (somtoy == '🍌 : 🍌 : 🍌') || (somtoy == '🍒 : 🍒 : 🍒') || (somtoy == '🔔 : 🔔 : 🔔') || (somtoy == '🍊 : 🍊 : 🍊') || (somtoy == '🍇 : 🍇 : 🍇')) {
var vitr = "Você ganhou!!!"
} else {
var vitr = "Você perdeu..."
}
if (vitr == "Você ganhou!!!") {
setTimeout(() => {
enviar(`Você ganhou🥳🥳🥳!!!`)
}, 1100)
}
sendEnviar(from, mess.slot(somtoy), mess.nameEnter(me), comando, prefix + comando);
break

case 'corno':
//@Tobi
addFilter(from);
if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return enviar('Você precisa mencionar alguém pra ver o nível do chifre')
mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
anu = Math.floor(Math.random() * 101)
if (anu > 50) {
teks = `*Após medir o* @${mentioned[0].split('@')[0]} *SUA PORCENTAGEM E DE : ${anu}% TU E UM BAITA CORNO EM SLK🐂*`
} else {
teks = `*Após medir o* @${mentioned[0].split('@')[0]} *SUA PORCENTAGEM E DE : ${anu}% SUA VEZ DE SER CORNO CHEGARA RLX😴!!*`
}
mentions(teks, mentioned, true)
break

case 'dado':
//@Tobi
addFilter(from);
const dadus = ["⚀",
"⚁",
"⚂",
"⚃",
"⚄",
"⚅"]
dadu = dadus[Math.floor(Math.random() * dadus.length)]
lolizita.sendMessage(from, {
sticker: fs.readFileSync('./base de dados/database/dados/'+dadu+'.webp')}, {
quoted: mek
})
break

case 'roleta':
//@Tobi
addFilter(from);
const tiro = ["vazio",
"vazio",
"vazio",
"vazio",
"vazio",
"vazio",
"vazio",
"vazio",
"pow",
"pow"]
const figr = ["pattta1",
"pattta2",
"pattta3"]
tpa = tiro[Math.floor(Math.random() * (tiro.length))]
tpb = figr[Math.floor(Math.random() * (figr.length))]
if (tpa == "vazio") {
var morte = "Você teve sorte dessa vez, o tambor estava vazio."
} else if (tpa == "pow") {
var morte = "Tinha uma bala no tambor, POW!"
}
if (morte == "Tinha uma bala no tambor, POW!") {
setTimeout(() => {
lolizita.sendMessage(from, {
sticker: fs.readFileSync('./base de dados/database/figurinhas/'+tpb+'.webp')})
}, 2100)
}
setTimeout(() => {
lolizita.sendMessage(from, {
text: morte
}, {
quoted: mek
})
}, 2300)
break

case 'tagme':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
const tagme = `@${sender.split("@")[0]} 🧙‍♂️`;
lolizita.sendMessage(from, {text: tagme, mentions: [sender]}, {quoted: mek});
break

case 'cassino':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
const sotoyMath = JSON.parse(fs.readFileSync('./base de dados/FilesJson/sotoy.json'))
const soto = [
'🍊 : 🍊 : 🍐',
'🍒 : 🔔 : 🍊',
'🍇 : 🍇 : 🍇',
'🍊 : 🍋 : 🍒',
'🔔 : 🍒 : 🍐',
'🔔 : 🍒 : 🍊',
'🍊 : 🍋 : 🍒',
'🍐 : 🍊 : 🍋',
'🍐 : 🍐 : 🍐',
'🍊 : 🍒 : 🍒',
'🔔 : 🔔 : 🔔',
'🍌 : 🍒 : 🔔',
'🍐 : 🔔 : 🔔',
'🍊 : 🍋 : 🍒',
'🍋 : 🍋 : 🍌',
'🔔 : 🔔 : 🍇',
'🔔 : 🍐 : 🍇',
'🔔 : 🔔 : 🔔',
'🍒 : 🍒 : 🍒',
'🍌 : 🍌 : 🍌'
]
const somtoy2 = sotoyMath[Math.floor(Math.random() * sotoyMath.length)]
if ((somtoy2 == '🥑 : 🥑 : 🥑') || (somtoy2 == '🍉 : 🍉 : 🍉') || (somtoy2 == '🍓 : 🍓 : 🍓') || (somtoy2 == '🍎 : 🍎 : 🍎') || (somtoy2 == '🍍 : 🍍 : 🍍') || (somtoy2 == '🥝 : 🥝 : 🥝') || (somtoy2 == '🍑 : 🍑 : 🍑') || (somtoy2 == '🥥 : 🥥 : 🥥') || (somtoy2 == '🍋 : 🍋 : 🍋') || (somtoy2 == '🍐 : 🍐 : 🍐') || (somtoy2 == '🍌 : 🍌 : 🍌') || (somtoy2 == '🍒 : 🍒 : 🍒') || (somtoy2 == '🔔 : 🔔 : 🔔') || (somtoy2 == '🍊 : 🍊 : 🍊') || (somtoy2 == '🍇 : 🍇 : 🍇')) {
var Vitória = "Você ganhou!!!"
} else {
var Vitória = "Você perdeu..."
}
sendEnviar(from, mess.somtoy2(somtoy2, Vitória), mess.nameEnter(me), comando, prefix + comando)
if (Vitória == "Você ganhou!!!") {
setTimeout(() => {
enviar(`Parabéns você ganhou!`)
}, 1100)
}
break

case 'caracoroa':
//@Tobi
addFilter(from);
const cara = fs.readFileSync('./base de dados/database/figurinhas/cara.webp');
const coroa = fs.readFileSync('./base de dados/database/figurinhas/coroa.webp');
cararo = ["cara", "coroa"]
fej = cararo[Math.floor(Math.random() * cararo.length)]
enviar(`você conseguiu: ${fej}`);
lolizita.sendMessage(from, {sticker: fs.readFileSync('./base de dados/database/figurinhas/'+fej+'.webp')}, {quoted: mek});
break

case 'sn':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (args.length < 1) return enviar(`Você deve fazer uma pergunta...\nExemplo: ${p}sn O ${SeuNome} é um baiano preguiçoso?`);
const sn = ['sim', 'não']
enviar(`${args.join(' ')}\n\nSegundo meus cálculos, eu acredito que... ${sn[Math.floor(Math.random() * (sn.length))]}`);
break

case 'amongus':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return enviar('Você precisa mencionar alguém')
mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
pro = '.\n'
for (let _ of mentioned) {
pro += `@${_.split('@')[0]}\n`
}
mentions(mess.amongus(mentioned), mentioned, true)
break

case 'preto':
case 'gay':
case 'feio':
case 'lixo':
case 'burro':
case 'gordo':
case 'pobre':
case 'corno':
case 'bonito':
case 'macaco':
case 'gostoso':
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
result = []
teks = `O mais *${comando}* é : `
for (i = 0; i < 1; i++) {
martrandom = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `@${groupMembers[martrandom].id.split('@')[0]}\n`
result.push(groupMembers[martrandom].id)
}
mentions(teks, result, true)
break

// COMANDOS ANIMES
case 'loli':
case 'shotas':
//@Tobi
addFilter(from); 
await enviar(mess.wait());
await getBuffer(api + `/api/loli?apikey=` + compreSuaApikey).then(buffer => {
lolizita.sendMessageButton1(from, comando + " || Imagens", nameBot, {image: buffer}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `🌟〘Next: ${comando}〙`, id: comando}}]);
}).catch(err => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
})
break;

//hentais
case 'ero':
case 'cum':
case 'cuckold':
case 'blowjob':
case 'gangbang':
case 'foot':
case 'femdom':
case 'hentai':
case 'sfwneko':
case 'jahy':
case 'panties':
case 'pussy':
case 'sfwNeko':
case 'tentacles':
case 'masturbation':
case 'orgy':
case 'bdsm':
case 'ass':
case 'nsfwneko':
case 'ahegao':
case 'zettairyouiki':
case 'yuri':
case 'thighs':
case 'nsfwloli':
//@Tobi
addFilter(from);
await enviar(mess.wait());
await getBuffer(api + `/api/${comando}?apikey=` + compreSuaApikey).then(buffer => {
lolizita.sendMessageButton1(from, comando + " || Imagens", nameBot, {image: buffer}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `🌟〘Next: ${comando}〙`, id: prefix + comando}}]);
}).catch(err => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break

// COMANDOS FIGURINHAS
case 'f':
case 'fig':
case 'gif':
case 'figura':
case 'figu':
case 'figurinha':
case 's':
case 'stiker':
case 'sticker':
case 'stickergif':
case 'stikergif': {
try {
//@Tobi
addFilter(from);
if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
encmedia = isQuotedImage ? mek.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage: mek.message.imageMessage
let rane = getRandom('.'+ await getExtension(encmedia.mimetype))
let imgbuff = await getFileBuffer(encmedia, 'image')
fs.writeFileSync(rane, imgbuff)
const media = rane
let ran = getRandom('.webp')
execute(`ffmpeg -i ${media} -vf scale=512:512 ${ran}`, async function(err, result) {
if (err) return enviar("❌ Ocorreu um erro!")
await lolizita.sendMessage(from, {sticker: {url: `./${ran}`}}, {quoted: mek});
await fs.unlinkSync(media)
await fs.unlinkSync(ran)
})
} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
encmedia = isQuotedVideo ? mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage: mek.message.videoMessage
let rane = getRandom('.'+ await getExtension(encmedia.mimetype))
let imgbuff = await getFileBuffer(encmedia, 'video')
fs.writeFileSync(rane, imgbuff)
const media = rane
let ran = getRandom('.webp')
enviar(mess.wait());
execute(`ffmpeg -i ${media} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${ran}`, async function(err, res) {
if (err) return enviar(mess.stickerError());
await lolizita.sendMessage(from, {
sticker: fs.readFileSync(ran)}, {
quoted: mek
})
fs.unlinkSync(media)
fs.unlinkSync(ran)
})
} else return enviar(mess.marking(prefix))
} catch (e) {
console.log(e)
enviar('Deu erro, tente novamente')
}
}
break

case 'attp1':
case 'attp2':
case 'attp3':
case 'attp4':
case 'attp5':
case 'attp6':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.textSyntax());
await enviar(mess.wait());
await getBuffer(`http://brizas-api.herokuapp.com/ttp/${comando}?apikey=brizaloka&text=${encodeURI(text)}`).then((m) => {
lolizita.sendMessage(from, {sticker: m}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError(err));
console.log("Error : %s", color(err, "red"));
});
break;

case 'tourl':
try {
//@Tobi
addFilter(from);
if ((isMedia && !mek.message.videoMessage || isQuotedImage || isQuotedVideo) && args.length == 0) {
quotedMess = isQuotedImage ? mek.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage: mek.message.imageMessage
let media = await lolizita.downloadAndSaveMediaMessage(quotedMess)
let {
telegraph
} = require('./base de dados/lib/uploader.js');
enviar(util.format(await telegraph(media)))
} else {
enviar('_* Use ou responda a uma foto ou vídeo *_')
}
} catch (err) {
enviar(err !== "Error: TypeError: Cannot read properties of undefined (reading 'src')" ? "Formado da foto incompatível." : mess.commandError())
console.log('Error : %s', color(err, 'red'));
}
break

case 'toimg': case 'togif':
if (!isQuotedSticker) return enviar(`Use ${prefix + comando} em um sticker`)
const typeStickerToimg = mek.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage;
if (typeStickerToimg.isAnimated === true) {
lolizita.downloadAndSaveMediaMessage(typeStickerToimg, 'sticker').then((obj) => {
togif(obj).then((buffer) => {
if (buffer.status === false) {
enviar('Error occurred');
} else if (buffer.status === true) {
enviar('⏳ Transformando sticker para gif..');
lolizita.sendMessage(from, {video: {url: buffer.result}, gifPlayback: true, caption: '✅'}, {quoted: mek});
};
}, (err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
sleep(1000).then(() => fs.unlinkSync(obj));
}, (err) => {
enviar(mess.commandError(err));
console.log('Error : %s',
color(err, 'red'));
});
} else if (typeStickerToimg.isAnimated === false) {
enviar('⏳ Transformando sticker para foto..');
lolizita.downloadMediaMessage(typeStickerToimg).then((value) => {
lolizita.sendMessage(from, {image: value, caption: '✅'}, {quoted: mek});
}, (err) => {
enviar(mess.commandError(err));
console.log("Error : %s", color(err, "red"));
});
};
break;

case 'emojimix':
teks = args.join(' ');
if (!teks) return enviar(`❌ Erro! O uso do emojimix deve conter dois emojis com um + entre eles:\n\n✔️ Exemplo sem emojis:\n\n⚠️ ${prefix + comando} [ Emoji ] + [ Emoji ]\n⚠️ ${prefix + comando} 😔+😍`);
if (!teks.includes("+")) return enviar(`❌ Erro! O uso do emojimix deve conter dois emojis com um + entre eles:\n\n✔️ Exemplo sem emojis:\n\n⚠️ ${prefix + comando} [ Emoji ] + [ Emoji ]\n⚠️ ${prefix + comando} 😔+😍`);
enviar('✓ Espere.. Fazendo emoji!');
const sey = getRandom('.webp');
fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${teks.split('+')[0]}_${teks.split('+')[1]}`).then((anu) => {
execute(`ffmpeg -i ${anu.results[0].url} -vf scale=512:512 ${sey}`, async function(err, result) {
lolizita.sendMessage(from, {sticker: fs.readFileSync(sey)}, {quoted: mek});
sleep(3000).then(() => {
fs.unlinkSync(sey);
console.log(' [ STICKER EMOJIMIX ]', color('Emoji apagado do banco de dados!', 'red'));
});
});
}).catch((err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
break;

case 'take':
case 'rename':
teks = args.join(' ');
if (!text.includes("|")) return enviar(`Ops! Cade o | ?`);
const { addExif, getExif } = require('./base de dados/lib/idExif');
buffer = await lolizita.downloadAndSaveMediaMessage(mek.message[type].contextInfo.quotedMessage.stickerMessage);
await addExif(buffer, {packname: teks.split("|")[0], author: teks.split("|")[1]});
lolizita.sendMessage(from, {sticker: fs.readFileSync(buffer)}, {quoted: mek});
sleep(3000).then(() => fs.unlinkSync(buffer));
break;

case 'stickanime':
//@Tobi
addFilter(from);
await enviar(mess.wait());
await fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-gambar-anime.txt').then(async(res) => res.text()).then(async(body) => {
let result = body.split("\n")[Math.floor(Math.random() * body.split("\n").length)]
await lolizita.sendImageAsSticker(from, result, mek, {packname: comando, author: nameBot})
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'nick':
case 'nickname':
teks = args.join(' ');
if (!teks) return enviar(`Erro! tente usar este exemplo: ${prefix + comando} Loli`);
enviar("✓ Espere! Gerando Nicks...");
fetchJson(api + `/api/nickName?nome=${teks}&apikey=${compreSuaApikey}`).then((value) => {
if (value.status === false) return enviar(valeu.message);
enviar(value.result.map((v) => v.text).join('\n'));
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

// COMANDOS CRIADOR
case 'eval':
case 'return':
if (!isOwner) return enviar(mess.onlyOwner());
console.log(color("Eval: ", "red"), budy.slice(5))
try {
eval(`(async () => {
try {
${budy.slice(5)};
} catch(err) {
console.log("Error : %s", color(err, "red"));
enviar(util.inspect(err));
}
})();`);
} catch(err) {
enviar(util.inspect(err));
}
break;

case 'ping':
if (!isOwner) return enviar(mess.onlyOwner());
enviar(latensi.toFixed(4) < 0.0500 ? `Ping de; ${latensi.toFixed(4)}: Muito rápido.` : latensi.toFixed(4) < 0.0200 ? `Ping de; ${latensi.toFixed(4)}: Velocidade regular.` : `Ping de; ${latensi.toFixed(4)}: Muito lento.`)
lolizita.sendMessageButton1(from, linguagem.ping(prefix, me, latensi, totalChats, process), mess.timeOnline(runtime, process), {image: logo}, [{index: 3, quickReplyButton: {displayText: 'Start menu?', id: prefix + 'menu'}}])
break

case 'sair':
if (!isOwner) return enviar(mess.onlyOwner());
enviar("Bye bye grupo...");
await sleep(5000);
lolizita.groupLeave(from);
break

case 'entrar':
if (!isOwner) return enviar(mess.onlyOwner());
teks = args.join(' ');
if (teks.length < 1) return enviar('Cade o link do grupo?');
lolizita.groupAcceptInvite(teks.split('https://chat.whatsapp.com/')[1]).then((value) => {
if (totalGrupos.find((obj) => obj === value)) return enviar('✓ Já entrei nesse grupo!');
enviar('Entrando nesse grupo!');
}, (err) => {
if (err.output.payload.error === "Internal Server Error") return enviar('O bot foi banido por um administrador.');
reply(err);
});
break

case 'addban':
try {
if (!isGroup) return enviar(mess.group());
if (!isOwner) return enviar(mess.onlyOwner());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso banir meu dono.");
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id !== "" && al_id !== "@s.whatsapp.net") {
if (addBanJson.includes(al_id)) return enviar("❌ Esse membro já foi registrado.");
addBanJson.push(al_id);
fs.writeFileSync('./base de dados/FilesJson/addBan.json', JSON.stringify(addBanJson, null, 2) + '\n')
enviar("✔️ Membro adicionado com sucesso.");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso banir meu dono.");
addBanJson.push(al_id);
fs.writeFileSync('./base de dados/FilesJson/addBan.json', JSON.stringify(addBanJson, null, 2) + '\n')
enviar("✔️ Membro adicionado com sucesso.");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'remban':
try {
if (!isGroup) return enviar(mess.group());
if (!isOwner) return enviar(mess.onlyOwner());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso remban meu dono.");
if (al_id != "" && al_id != "@s.whatsapp.net") {
if (addBanJson.includes(al_id)) return enviar("❌ Esse membro já foi removido.");
addBanJson.splice(al_id);
fs.writeFileSync('./base de dados/FilesJson/addBan.json', JSON.stringify(addBanJson, null, 2) + '\n')
enviar("✔️ Membro removido com sucesso.");
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
if (al_id.includes(owner[0])) return enviar("❌ Erro! Não posso remban meu dono.");
addBanJson.splice(al_id);
fs.writeFileSync('./base de dados/FilesJson/addBan.json', JSON.stringify(addBanJson, null, 2) + '\n')
enviar("✔️ Membro removido com sucesso.");
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError())
console.log("Error : %s", color(e, "red"));
}
break;

case 'bangroupo':
case 'bangroup':
case 'bangrup':
try {
//@Tobi
addFilter(from);
if (!isGroup) return enviar(mess.group());
if (!isOwner) return enviar(mess.onlyOwner());
if (!args[0].startsWith("on") && !args[0].startsWith("off")) return enviar(`❌ Erro! Você quer ligar? ou Dedligar?\n\n➡️ ${prefix + comando} on [ Para ligar ]\n➡️ ${prefix + comando} off [ Para Desligar ]\n\n⚠️ ${comando} Irá banir este grupo de usarem comandos, só meu dono/owner poderá usar comandos e desligar o ${comando}.`);
if (args[0] === "on") {
if (listGroup.includes(from)) return enviar("❌ Erro! Esse grupo já foi registrado.");
listGroup.push(from)
fs.writeFileSync('./base de dados/FilesJson/listGroup.json', JSON.stringify(listGroup, null, 2) + '\n')
enviar(`✔️ *Grupo adicionado na database do bot.*\n\n_*⚠️ ${comando} serve para banir o uso do bot e dos comandos em um grupo específico.*_`);
} else if (args[0] === "off") {
if (!listGroup.includes(from)) return enviar("❌ Erro! Esse grupo já foi removido.");
listGroup.splice(from)
fs.writeFileSync('./base de dados/FilesJson/listGroup.json', JSON.stringify(listGroup, null, 2) + '\n')
enviar(`❌ *Grupo removido da database do bot.*\n\n_*⚠️ ${comando} serve para banir o uso do bot e dos comandos em um grupo específico.*_`);
}
} catch (err) {
enviar(String(err).includes("TypeError: Cannot read properties of undefined (reading 'startsWith')") ? `❌ Erro! Você quer ligar? ou Dedligar?\n\n➡️ ${prefix + comando} on [ Para ligar ]\n➡️ ${prefix + comando} off [ Para Desligar ]\n\n⚠️ ${comando} Irá banir este grupo de usarem comandos, só meu dono/owner poderá usar comandos e desligar o ${comando}.`: "Tipo de erro não identificado.");
console.log("Error : %s", color(err, "red"));
}
break;

case 'bcall':
//@Tobi
addFilter(from);
if (!isOwner) return enviar(mess.onlyOwner());
if (args.length < 1) return enviar(`❌ Erro! Use esse exemplo abaixo:\n➡️ ${prefix + comando} [ Text ]\n\n🔖 [ *${prefix + comando}* ] Serve para fazer uma transmissão entre: Grupos e Pessoas no privado! Escreva um pequeno texto para todos lerem.`);
if (totalChatId.length < 0) return enviar("Nenhum grupo registrado.");
for(let i of totalChatId) {
await lolizita.sendMessage(i, {image: logo, caption: text});
}
await enviar(`🔖 Transmissão feita com sucesso\n\n➡️ Total chats que receberam a transmissão: [ *${totalChatId.length}* ]`);
break;

case 'crash':
try {
//@Tobi
addFilter(from);
if (!isOwner) return enviar(mess.onlyOwner());
let al_id = text.replace(new RegExp("[()+-/ +/]", "gi"), "").replace("@", '') + "@s.whatsapp.net";
if (text.indexOf('@') !== text.lastIndexOf('@')) return enviar("❌ Erro! Não pode mencionar 2 (dois) membros.")
if (al_id != "" && al_id != "@s.whatsapp.net") {
enviar("Pronto! Crashando...");
key = {key: {"remoteJid": '', "fromMe": mek.key.fromMe, "id": mek.key.id, "participant": al_id}, message: {conversation: 'meu nome e yoshikage kira'}}
lolizita.sendMessage(al_id, {text: 'null'}, {quoted: key});
} else {
let al_id = mek.message.extendedTextMessage.contextInfo.participant
enviar("Pronto! Crashando...");
key = {key: {"remoteJid": '', "fromMe": mek.key.fromMe, "id": mek.key.id, "participant": al_id}, message: {conversation: 'meu nome e yoshikage kira'}}
lolizita.sendMessage(al_id, {text: 'null'}, {quoted: key});
}
} catch (e) {
enviar(String(e).includes("TypeError: Cannot read properties of null (reading 'contextInfo')") ? `❌ Erro! Não foi possível indentificar o tipo de marcação/mensão.\n\n➡️ Exemplos:\n${prefix + comando} @${owner[0].split("@")[0]}\n${prefix + comando} ${owner[0].split("@")[0]}\nOu marque a mensagem do membro com ${prefix + comando}`: mess.commandError());
console.log("Error : %s", color(e, "red"));
};
break;

case 'mek':
if (!isOwner) return enviar(mess.onlyOwner());
enviar(JSON.stringify(mek, null, 2));
break;

case 'divulgar':
if (!isOwner) return enviar(mess.onlyOwner());
teks = args.join(' ');
if (teks.length < 1) return enviar('Coloque o texto! Ele servirá para ser divulgado.');
if (!teks.includes("+")) return enviar(`❌ Erro! O uso do ${comando} deve conter + entre eles:\n\n✔️ Exemplo:\n\n⚠️ ${prefix + comando} [ Link ] + [ Texto ]\n⚠️ ${prefix + comando} hhttps://chat.whatsapp.com/blanlabla+Seu texto depois desse: +`);

lolizita.groupAcceptInvite(teks.split('+')[0].split("https://chat.whatsapp.com/")[1]).then(async value => {
const dataGroup = await lolizita.groupMetadata(value);
const totalMem = dataGroup.participants.map((objId) => objId.id);
   
enviar(`• *Id*: ${dataGroup.id}
• *Nome*: ${dataGroup.subject}
• *Criador*: ${dataGroup.owner.split('@')[0]}
• *Descrição*: ${dataGroup.desc}
• *Total membros*: ${dataGroup.participants.map((obj) => obj.id).length}
• *Total Admin*: ${dataGroup.participants.filter((obj) => obj.admin).length}`);
     
const getMembros = dataGroup.participants.map((obj) => obj.id).length
setTimeout(() => enviar(`A divulgação com ${getMembros} membros, acabou! Tente outra divulgação.`), getMembros * 10000);
    
let timestamp = 0;
for (const item of totalMem) {
const array = [];
array.push(item);
setTimeout(() => lolizita.sendMessage(item, {text: teks.split('+')[1]}), timestamp);
timestamp += 10000;
};
sleep(20000).then(() => {
lolizita.groupLeave(value);
console.log('[ GRUPO EXPIRADO ]', color('Saindo do grupo!', 'red'))
enviar('Saindo do grupo, 20 segundos expirado!')
});
},(err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
break;

case 'divu':
const message = args.join(' ');
if (!isOwner) return enviar(mess.onlyOwner());
if (message.length < 1) return enviar('Coloque o texto! Ele servirá para ser divulgado.');
fetchJson(`${api}/api/linkswhatapp?apikey=${compreSuaApikey}`).then((group) => {
if (group.status === true) {
enviar('Gerando dados, espere um  momento!');
teks = `*Nome:* ${group.resultado.nome}
*Acessos:* ${group.resultado.acessos}
*Dia publicado:* ${group.resultado.publicado}
*Dia verificado:* ${group.resultado.verificado}
*Link:* ${group.resultado.link}

• *Descrição:* ${group.resultado.desc}`;
lolizita.sendMessageButton1(from, teks, 'Comando para divulgar texto em grupos aleatórios! Tente divulgar algo.', {
image: {
url: group.resultado.foto
}
}, [{
quickReplyButton: {
displayText: "✔️ Confirmar", id: `${prefix}divulgar ${group.resultado.link}+${message}`
}}, {
quickReplyButton: {
displayText: "Gerar outro grupo!", id: `${prefix}divu ${message}`
}}]);
} else if (group.status === false) {
enviar('some error occurred');
};
}, (err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
break;
  
case 'reiniciar':
case 'restart':
enviar('Aguarde! Reiniciando em 5 segundos..');
sleep(5000).then(() => process.exit());
break;

// COMANDOS consultas
case 'ddd':
//@Tobi
addFilter(from);
if (args.length < 1) return enviar(mess.ddd(prefix, comando));
if (isNaN(text)) return enviar("❌ Erro! Proibido letras.");
await enviar(mess.wait());
await fetchJson(`https://lolizit-api.herokuapp.com/api/consulta/ddd?code=${text}&apikey=` + compreSuaApikey).then(({resultado}) => {
lolizita.sendMessageButton1(from, mess.messageDdd(resultado), nameBot, {image: logo}, [{urlButton: {displayText: 'Rest Apis ❄️', url: api}}, {quickReplyButton: {displayText: `❤️〘 Status 〙❤️`, id: prefix + 'status'}}]);
}).catch((err) => {
enviar(String(err) === "TypeError: Cannot read properties of undefined (reading 'join')" ? "❌ Erro! Não é permitido letras." : String(err));
});
break

case 'cep':
//@Tobi
addFilter(from);
teks = args.join(' ');
if (text === "") return enviar(`*❌ Erro! Esse comando consulta dados sobre um cep desejado! consulte algum cep assim:*\n\n➡️ ${prefix + comando} [ Cep ]\n⚠️ Exemplo: ${prefix + comando} 68459-604`);
enviar('✓ Fazendo consulta.. Espere!');
fetchJson(`${api}/api/consulta/cep?code=${teks}&apikey=${compreSuaApikey}`).then(async(anu) => {
if (anu.status === false) return enviar(anu.message);
if (anu.status === true || anu.code === 200) {
lolizita.sendMessage(from, {text: mess.cepConsultation(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.cepConsultation(anu)}}], footer: nameOwner}, {quoted: mek});
await sleep(3000); lolizita.sendMessage(from, {location: {degreesLatitude: anu.result.latitude, degreesLongitude: anu.result.longitude}}, {quoted: mek})
};
}).catch((err) => {
enviar('❌ Não achei dados sobre esse cep!');
console.log('Error : %s', color(err, 'red'));
});
break

case 'ip':
teks = args.join(' ');
await enviar('✓ Fazendo consulta, espere!');
fetchJson(`${api}/api/consulta/ip?code=${teks}&apikey=${compreSuaApikey}`).then((anu) => {
if (anu.status === false || anu.code === 403) return enviar(anu.message);
if (anu.status === true || anu.code === 200) return lolizita.sendMessage(from, {text: mess.queryIp(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.queryIp(anu)}}], footer: mess.typeMessageConsulta(pushname, nameOwner)}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'gcpf':
await enviar('✓ Gerando cpf, espere!');
fetchJson(`${api}/api/gerador/cpf?apikey=${compreSuaApikey}`).then((anu) => {
if (anu.status === false || anu.code === 403) return enviar(anu.message);
if (anu.status === true || anu.code === 200) return lolizita.sendMessage(from, {text: mess.generatorCpf(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.generatorCpf(anu)}}], footer: mess.typeMessageConsulta(pushname, nameOwner)}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'gcnpj':
await enviar('✓ Gerando cnpj, espere!');
fetchJson(`${api}/api/gerador/cnpj?apikey=${compreSuaApikey}`).then((anu) => {
if (anu.status === false || anu.code === 403) return enviar(anu.message);
if (anu.status === true || anu.code === 200) return lolizita.sendMessage(from, {text: mess.generatorCnpj(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.generatorCnpj(anu)}}], footer: mess.typeMessageConsulta(pushname, nameOwner)}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError());
console.log('Error : %s', color(err, 'red'));
});
break;

case 'gbank':
//@Tobi
addFilter(from);
enviar('✓ Gerando banco, Espere!');
fetchJson(api + "/api/gerador/banco?apikey=" + compreSuaApikey).then((anu) => {
if (anu.status === false || anu.code === 403) return enviar(anu.message);
if (anu.status === true || anu.code === 200) return lolizita.sendMessage(from, {text: mess.generatorBanco(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.generatorBanco(anu)}}], footer: mess.typeMessageConsulta(pushname, nameOwner)}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
break;

case 'banco':
//@Tobi
addFilter(from);
teks = args.join(' ');
if (teks === "") return enviar(`❌ Erro! Use assim:\n\n➡️ ${prefix + comando} 260`);
enviar('✓ Fazendo consulta, espere!');
fetchJson(`${api}/api/consulta/banco?code=${teks}&apikey=${compreSuaApikey}`).then((anu) => {
if (anu.status === false || anu.code === 403) return enviar(anu.message);
if (anu.status === true || anu.code === 200) return lolizita.sendMessage(from, {text: mess.generatorBanco(anu), templateButtons: [{index: 1, urlButton: {displayText: "Copiar", url: 'https://www.whatsapp.com/otp/copy/' + mess.generatorBanco(anu)}}], footer: mess.typeMessageConsulta(pushname, nameOwner)}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError(err));
console.log('Error : %s', color(err, 'red'));
});
break;

case 'playlist':
//@Tobi
addFilter(from); 
if (args.length < 1) return enviar(mess.textSyntax());
yts(text).then(({all}) => {
const m = all.filter((id) => id.type === 'video');
const array = [];
for (let i of m) {
array.push({tilte: i.length, title: `➡️ Nome: ${i.title}?`, rowId: `${prefix}tocar ${i.title}`, description: `Tempo: ${i.timestamp}\nViews: ${i.views}\nCriador: ${i.author.name}\nLink: ${i.url}`});
}
lolizita.sendMessage(from, {text: "by toba", footer: `${nameBot}`, title: `Sua pesquisa: ${text}`, buttonText: "Ler mais...", sections: [{rows: array}]}, {quoted: mek});
}).catch((err) => {
enviar(mess.commandError(err));
console.log("Error : %s", color(err, "red"));
});
break;

case 'ghots': case 'ghosts': case 'inativos':
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (ghosts.length === 0) return enviar('❌ Não tem membros ghosts nesse grupo!');
teks = `Total membros com 0 mensagens: ${ghosts.length}\n\n`;
for(const item of ghosts) teks += `× @${item.split('@')[0]}\n`;
mentions(teks, ghosts, false);
break;

case 'banghost':
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
if (ghosts.length === 0) return enviar('❌ Não tem membros sem mensagem nesse grupo!');
let timeBanished = 0;
for (const stream of ghosts) {
setTimeout(() => lolizita.groupParticipantsUpdate(from, [stream], "remove"), timeBanished);
timeBanished += 1000;
};
break;

case 'ativos': case 'atividades':
if (!isGroup) return enviar(mess.group());
if (!isGroupAdmins) return enviar(mess.admin());
if (!isBotGroupAdmins) return enviar(mess.fromAdmin());
const getInfoMessage = _messageCount.groups.find((obj) => obj.groupId === from);
if (!getInfoMessage) return enviar('Grupo não registrado!');
const idMembers = Object.keys(getInfoMessage.users);
const messageMembers = Object.values(getInfoMessage.users);
teks = `Total membros: ${idMembers.length}\nTotal mensagens: ${getInfoMessage.total}\n`;
for (let i = 0; i < idMembers.length; i++) teks += `\n*× Membro:* @${idMembers[i].split('@')[0]}\n*× Total mensagens:* ${messageMembers[i]}\n`;
mentions(teks, idMembers, false);
break;

default:

if (budy.startsWith("=>")) {
if (!isOwner) return;
try {
eval(`(async () => {
try {
${budy.slice(3)};
} catch(err) {
enviarJson(from, err, {quoted: mek});
console.log("Error : %s", color(err, "red"));
}
})();`);
} catch(err) {
enviarJson(from, err, {quoted: mek});
console.log("Error : %s", color(err, "red"));
};
};

if (budy.startsWith("$")) {
if (!isOwner) return;
exec(budy.slice(2), (err, result) => {
if (err) return lolizita.sendMessageJson(from, err, {quoted: mek});
enviar(result);
});
}; 

}
} catch (error) {
err = String(error);
if (err.includes("Connection Closed") && err.includes("Timed Out")) return;
lolizita.sendMessage(owner[0], {text: require('util').inspect(error)});
console.log('Error : %s', color(err, 'red'));
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
let {
bannerText
} = require('./base de dados/lib/banner');
console.log(bannerText(`Update file: ${__filename}`).string);
delete require.cache[file]
require(file)
});