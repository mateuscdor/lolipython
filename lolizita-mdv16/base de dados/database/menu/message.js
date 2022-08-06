//Horas
const moment = require("moment-timezone");
const hours = moment.tz('America/Sao_Paulo').format('HH:mm:ss')

const fs = require('fs');
const chalk = require('chalk');
const emojiFunction = "︎︎⚠︎"
const errEmoji = "❌";

//connected 
exports.connected = () => {
return `Bot conectado as; ${hours}.`
}
//onlyOwner
exports.onlyOwner = () => {
return `_*Desculpe, esse comando só pode ser usado pelo meu dono!*_`;
}

//banned
exports.banned = () => {
  return "❌ Erro! Você foi banido de usar comandos."
}

//commandError
exports.commandError = (err) => {
  console.log(String(err));
  const typeErroObj =
  String(err) === "AxiosError: Request failed with status code 503" ? `${errEmoji} Erro! Caminho da url ao site está com erro. Tente novamente depois..`:
  String(err) === "TypeError: Cannot read properties of undefined (reading 'seconds')" ? `${errEmoji} Erro! "Seconds" indefinido. Tente outra pesquisa.`:
  String(err) === "TypeError: Cannot read properties of undefined (reading 'Telefone')" ? `${errEmoji} Não a dados sobre esse telefone!`:
  String(err) === "TypeError: Cannot read properties of undefined (reading 'Nome')" ? `${errEmoji} Não existe titulares desse número.`:
  String(err) === "Error: Request failed with status code 503" ? `${errEmoji} Erro! esse comando está temporariamente offline.`:
  String(err) === "TypeError: Cannot read properties of undefined (reading 'url')" ? "Os emojis não foram identificados! Tente outros.":
  String(err.type) === 'invalid-json' ? `${errEmoji} Url não encontrada, talvez esse site não exista.`: `${errEmoji} Erro! Este comando está apresentando falhas.`;
  return typeErroObj;
}

//playResult
exports.playResult = (anu) => {
return `▢ *Nome: ${anu.resultado.título}*\n▢ *Canal: ${anu.resultado.canal}*\n▢ *Publicado: ${anu.resultado.publicado}*\n▢ *Visualizações: ${anu.resultado.visualizações}*`;
}

//playScraper 
exports.playScraper = (m) => {
  return `▢ Nome: *${m.title}*
▢ Url: *${m.url}*
▢ Descrição: *${m.description}*
▢ Segundos: *${m.seconds}*
▢ Duração: *${m.timestamp}*
▢ Postagem: *${m.ago}*
▢ Visualizações: *${m.views}*`
}

//playScraperErroArray 
exports.playScraperErroArray = (m) => {
  return `▢ Nome: *${m.all[1].title}*
▢ Url: *${m.all[1].url}*
▢ Descrição: *${m.all[1].description}*
▢ Segundos: *${m.all[1].seconds}*
▢ Duração: *${m.all[1].timestamp}*
▢ Postagem: *${m.all[1].ago}*
▢ Visualizações: *${m.all[1].views}*`
}

//notiferr
exports.notiferr = (prefix, comando) => {
return `*_🗣️ Use assim: ${prefix + comando} on; Para ativar._*

*${prefix + comando} off; Para desativa*`;
}

//activecommand
exports.activecommand = (comando) => {
return `*_🗣️ O comando ${comando} já está ativado neste grupo._*`;
}

//commandDisabled
exports.commandDisabled = (comando) => {
return `*_🗣️ O comando já foi desativado neste grupo._*`
}

//wait
exports.wait = () => {
teks = ["_*...espere, já estou realizando seu comando*_", "_*calma calma não tenha pressa*_", "_*realizando suas ordens!*_", "_*aguarde!! Estou indo o mais rápido possível*_", "_*Aguarde O-onichan*_", "_*Entendido!! Aguarde.*_", "_*espere um pouco amigo*_"]; 
buff = teks[Math.floor(Math.random() * teks.length)]; 
return buff
}

//randomMenu
exports.randomMenu = () => {
random = ["grupo", "logos", "jogos", "criador", "animes", "download", "figurinhas", "consultas"];
return random[Math.floor(Math.random() * random.length)]; 
}

exports.ping = (latensi, totalGrupos, totalChats, process, runtime, owner) => {
return `🌟〘Status do bot〙
🏓 Ping: *${latensi.toFixed(4)}*
❄️ Total grupos: *${totalGrupos.length}*
🗣️ Total chats: *${totalChats.length}*
🧝🏼‍♀️ Dono: wa.me/${owner[0].split("@")[0]}
✅ Online a: *${runtime(process.uptime())}*`;
}

//textSyntax
exports.textSyntax = () => {
return `_*🗣️Ops... cadê o texto amigo?*_`;
}

//messageButton
exports.messageButton = () => {
 return "--- [ Mensagem Enviada ] ---"
}
//ddd
exports.ddd = (prefix, comando) => {
return `_*🗣️Ops... Use assim: ${prefix + comando} 94*_`;
}

//linkSyntax
exports.linkSyntax = () => {
return `_*🗣️Ops... cadê o link amigo?*_`;
}

//textNotAllowed 
exports.textNotAllowed = () => {
return `_*🗣️Link inválido, ou não corresponde ao comando.*_`;
}

//group
exports.group = () => {
return `_*🗣️ Comando só permitido em grupos.*_`;
}

//admin
exports.admin = () => {
return `Oops, preciso do meu admin querido!`;
}

//fromAdmin
exports.fromAdmin = () => {
return `_*🗣️Preciso ser admin pra usarem este comando.*_`;
}

//limit
exports.limit = () => {
return `_*🗣️Limite de caracteres atingido.*_`;
}

//name
exports.name = (me) => {
return `© ${me.name}`;
}

//Name + enter
exports.nameEnter = (me) => {
return `\n${me.name}`
}

//openClose
exports.openClose = () => {
return `*🗣️ Escolha entre abrir/fechar*`;
}

//markMessage 
exports.markMessage = () => {
return `_*🗣️Marque a mensagem da pessoa pra ser expulso.*_`;
}

//mentioned1
exports.mentioned1 = (mentioned1) => {
return `_*🗣️Membro; @${mentioned1.split('@')[0]} promovido a administrador.*_`;
}

//mentioned2
exports.mentioned2 = (mentioned2) => {
return `_*🗣️Membro; @${mentioned2[0].split('@')[0]} promovido a administrador.*_`;
}

//downgrade
exports.downgrade = (mentioned1) => {
return `_*🗣️Membro; @${mentioned1.split('@')[0]} rebaixado.*_`;
}

//downgrade1
exports.downgrade1 = (mentioned2) => {
return `_*🗣️Membro; @${mentioned2[0].split('@')[0]} rebaixado.*_`;
}

//demoteMomber
exports.demoteMomber = (demote) => {
return `_*🗣️Membro; @${demote.split('@')[0]} rebaixado.*_`;
}

//demoteMomber1
exports.demoteMomber1 = (mentioned) => {
return `_*🗣️Membro; @${mentioned[0].split('@')[0]} rebaixado.*_`;
}

//twoMarkings
exports.twoMarkings = () => {
return `
*❌ Erro encontrado. ❌*

_*🗣 Só é possível uma marcação!*_️`;
}

//changedDescription
exports.changedDescription = (args) => {
return `_*🗣️Nome do grupo alterada para:*_\n\n*${args.join(' ')}*`;
}

//maximumMumber
exports.maximumMumber = () => {
return `_*🗣️O máximo de letras é de até 25 caracteres.*_`;
}

//textNotAllowed 
exports.textNotAllowed = () => {
return `🗣️ *Link inválido, ou não corresponde ao comando.*`;
}

//stickerError
exports.stickerError = () => {
return `_*🚫 Erro na criação de figurinha. 🚫`
}

//marking
exports.marking = (prefix) => {
return `Marque a imagem com o comando ${prefix}sticker ou coloque na legenda, o video ou gif so pode ter 10 segundos de duração`;
}

//functionOff
exports.functionOff = (comando) => {
return `*_${emojiFunction} Função ${comando} desativado com sucesso!_*`;
}

//functionOn
exports.functionOn = (comando) => {
return `*_${emojiFunction} Função ${comando} ativado com sucesso!_*`;
}

//modeOff
exports.modeOnn = (comando) => {
return `*_${emojiFunction} Comando: ${comando}_*

*Situação: ${comando} Está desativado*`;
}

//modeOff
exports.modeOff = (comando) => {
return `*_${emojiFunction} Comando: ${comando}_*

*Situação: ${comando} Está ligado*

Use: `;
}

//onlineCommand
exports.onlineCommand = (isAntiLink) => {
return `${isAntiLink ? "antilink on" : "antilink off"}`;
}

//downloadMediafire
exports.downloadMediafire = (anu) => {
return `
き⃟❗️MEDIAFIRE DOWNLOAD❗⃟ き

📁 Nome : ${anu.resultado[0].nome}
📊 Tamanho : ${anu.resultado[0]. tamanho}
🧧 Link : ${anu.resultado[0].link}

_*Aguarde o processo de upload de mídia......*_`;
}

//sendErrApis
exports.sendErrApis = (error, comando, hr, pushname, sender, err) => {
return `▢ ⌁ Info erro:
▢ Tipo: ${error.slice(0, 10)}
▢ Total letras: *${error.length}*
▢ Comando: *${comando}*
▢ Arquivo: *${__filename}*
▢ Hora: *${hr}*

▢ ⌁ Info usuário:
▢ Nome: ${pushname}
▢ Numero: wa.me/${sender.split('@')[0]}

*🗣️ERRO ADQUIRIDO🚫*
${error.split("&apikey=Tobi")}`;
}

//somtoy2
exports.somtoy2 = (somtoy2, Vitória) => {
return `
╭━━ ⪩
▢ き⃟🎰 ᥴᥲ᥉᥉ιᥒ᥆ 💰⃟ き
▢ ╭═══⊷
▢  ${somtoy2} ◄
▢ ╰═══⊷
╰━━━ ⪨

*${Vitória}*`;
}

//slot
exports.slot = (somtoy) => {
return `Consiga 3 iguais para ganhar


╭╾╾╾╾ ≪ •❈• ≫ ╾╾╾╾╗
║         [💰SLOT💰 | 777 ]        
║                                             
║                                             
║           ${somtoy}  ◄━━┛
║            
║                                           
║          [💰SLOT💰 | 777 ]        
╚╾╾╾╾ ≪ •❈• ≫ ╾╾╾╾╝`;
}

exports.amongus = (mentioned) => {
return `.      　。　　　　•　    　ﾟ　　。

　　.　　　.　　　  　　.　　　　　。　　   。　.

　.　　      。　        ඞ   。　    .    •
•            @${mentioned[0].split('@')[0]} was E j e c t e d
                  1 impostor remain   。　.
　 　　。　　 　　　　ﾟ　　　.　      　　　.
,　　　　.                  .`
};

exports.messageDdd = (resultado) => {
return `🗣️Consulta - ddd.

✅ Cidades: ${resultado[0].cidades.join('\n')}`;
}

exports.messageCep = (anu) => {
return `🗣️Consulta - cep.

${anu.status ? "✅ Consulta: Realizada." : "🚫 Consulta: Cep inexistente."}
✅ Cep: *${anu.resultado.cep}*
✅ Cidade: *${anu.resultado.cidade}*
✅ bairro: *${anu.resultado.bairro}*
✅ Rua: *${anu.resultado.rua}*
✅ Serviço: *${anu.resultado.servico}*`;
}

exports.listbanc = () => {
return "🗣️ Consulta - lista bancos.\n\n"
}

exports.commandListBanc = (res) => {
return `✅ Nome: *${res.nome}*
✅ Ispb: *${res.ispb}*
✅ Codigo: *${res.codigo}
✅ Nome completo: *${res.nomeCompleto}*\n\n`;
}

exports.bankConsultation = (anu) => {
return `🗣️ Consulta - banco.

✅ Nome: *${anu.resultado.nome}*
✅ Codigo: *${anu.resultado.codigo}*
✅ Ispb: *${anu.resultado.ispb}*
✅ Nome completo: *${anu.resultado.nomeCompleto}*`;
};

exports.queryIp = (anu) => {
return `🔎 Consulta - Ip 🔍

➡️ Info
▢ Asn: *${anu.info.asn}*
▢ ispName: *${anu.info.ispName}*
▢ Organização: *${anu.info.organizacao}*
▢ Tipo de Conexão: *${anu.info.tipoDeConexao}*

➡️ Info cidade
▢ País: *${anu.infoCidade.pais}*
▢ Região: *${anu.infoCidade.regiao}*
▢ Cidade: *${anu.infoCidade.cidade}*
▢ Postal Code: *${anu.infoCidade.postalCode}*
▢ Metro Code: *${anu.infoCidade.metroCode}*
▢ Area Code: *${anu.infoCidade.areaCode}*
▢ Latitude: *${anu.infoCidade.longitude}*
▢ Longitude: *${anu.infoCidade.longitude}*
▢ Codigo do País: *${anu.infoCidade.codigoDoPais}*

➡️ Info wifi
▢ Servidor: *${anu.infoWifi.servidor}*
▢ Proxy da Web: *${anu.infoWifi.proxyDaWeb}*
▢ Robo de Busca: *${anu.infoWifi.RoboDeBusca}*
▢ Vpn De Anonimização: *${anu.infoWifi.vpnDeAnonimizacao}*
▢ Procuração Pública: *${anu.infoWifi.procuracaoPublica}*
`;
};

exports.cepConsultation = (anu) => {
return `🔎 Consulta - Cep 🔍

➡️ Resultado
▢ Ddd: *${anu.result.ddd}*
▢ Cep: *${anu.result.cep}*
▢ Rua: *${anu.result.rua}*
▢ Cidade: *${anu.result.cidade}*
▢ Região: *${anu.result.regiao}*
▢ Bairro: *${anu.result.bairro}*
▢ Latitude: *${anu.result.latitude}*
▢ Longitude: *${anu.result.longitude}*`;
};

exports.generatorCpf = (anu) => {
return `🔎 Gerador - Cpf 🔍

▢ [ Cpf ] Sem pontuação: *${anu.result.cpfSemPontos}*
▢ [ Cpf ] Com pontuação: *${anu.result.cpfComPontos}*`;
};

exports.generatorCnpj = (anu) => {
return `🔎 Gerador - Cnpj 🔍

▢ [ Cnpj ] Sem pontuação: *${anu.result.cnpjSemPontos}*
▢ [ Cnpj ] Com pontuação: *${anu.result.cnpjComPontos}*`;
};

exports.generatorBanco = (anu) => {
  return `🔎 Gerador - Banco 🔍

▢ [ ispb ]: *${anu.result.ispb}*
▢ [ name ]: *${anu.result.name}*
▢ [ code ]: *${anu.result.code}*
▢ [ fullname ]: *${anu.result.fullName}*`;
};

exports.cepSearch = (prefix, comando) => {
return `_*🗣️Ops... Use assim: ${prefix + comando} 89010025`;
}

exports.timeOnline = (runtime, process) => {
return `Tempo online:「${runtime(process.uptime())}」`;
}

exports.getPerfil = async(getPushName, getRecado, getMessagePrivado, getTotalMessageGroup, from, al_id) => {
return `▢ Nome: ${getPushName(al_id)}
▢ Recado: ${(await getRecado(al_id)).status}
▢ Mensagens/Privado: ${getMessagePrivado(al_id)}
▢ Mensagens/Grupo: ${getTotalMessageGroup(al_id, from)}`;
}

exports.getPerfilSender = async(getPushName, getRecado, getMessagePrivado, getTotalMessageGroup, from, sender) => {
return `▢ Nome: ${getPushName(sender)}
▢ Recado: ${(await getRecado(sender)).status}
▢ Mensagens/Privado: ${getMessagePrivado(sender)}
▢ Mensagens/Grupo: ${getTotalMessageGroup(sender, from)}`;
}

exports.typeMessageConsulta = (pushname, nameOwner) => {
  return ` © User: ${pushname}; By: ${nameOwner};`
};