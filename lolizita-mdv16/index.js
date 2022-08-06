const {
  default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState,
    downloadContentFromMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    proto,
    downloadMediaMessage
  } = require('@adiwajshing/baileys');

  const cfonts = require('cfonts')
  const pino = require('pino');
  const fs = require('fs');
  const chalk = require('chalk');
  const FileType = require('file-type')
  const qrcode = require("qrcode-terminal");

  // Arquivos
  const {
    state,
    saveState
  } = useSingleFileAuthState('./qr.json');

  const {
    color,
    logs
  } = require('./base de dados/lib/color');

  const {
    linguagem,
    mess
  } = require('./base de dados/database/menu');

  const {
    banner,
    banner2,
    bannerText
  } = require('./base de dados/lib/banner');

  const {
    getGroupAdmins,
    getRandom,
    getExtension,
    getBuffer,
    fetchJson,
    sleep,
    runtime,
    isUrl,
    getFileBuffer,
    readMore,
    togif
  } = require('./base de dados/lib/functions');

  const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
  } = require('./base de dados/lib/exif');

  const {
    prefixo,
    owner,
    compreSuaApikey,
    api,
    logo
  } = require('./configure aqui.js');

  // Funções
  const welcome = JSON.parse(fs.readFileSync('./base de dados/FilesJson/welcome.json'));
  const antifake = JSON.parse(fs.readFileSync('./base de dados/FilesJson/antifake.json'));
  const antiListaNegra = JSON.parse(fs.readFileSync('./base de dados/FilesJson/listaNegra.json'));
  const _messageCount = JSON.parse(fs.readFileSync('./base de dados/FilesJson/messages.json'));

  // Function versão baileys
  async function version() {
    try {
      var res = await fetchJson("https://web.whatsapp.com/check-update?version=1&platform=web");
      return {
        value: res.currentVersion.split('.')
      };
    } catch (err) {
      return {
        value: [2,
          2204,
          13]
      };
    }
  }

  async function lolizitaStartIndex() {
    const versionBaileys = await version();
    const lolizita = makeWASocket({
      printQRInTerminal: true,
      logger: pino({
        level: 'silent'
      }),
      browser: ['NS Multi Device', 'Chrome', '3.0'],
      version: versionBaileys.value,
      auth: state,
      defaultQueryTimeoutMs: undefined
    })

    // Store
    const store = makeInMemoryStore({
      logger: pino().child({
        level: 'silent', stream: 'store'
      })
    })

    store.readFromFile('./baileys_store.json')

    setInterval(() => {
      store.writeToFile('./baileys_store.json')
    }, 10000)

    store.bind(lolizita.ev)

    lolizita.ev.on('messages.upsert', async m => {
      if (m.type != 'notify') return;
      const mek = m.messages[0];
      require('./lolizita')(lolizita, mek, store, welcome, antifake, antiListaNegra, _messageCount);
    });

    lolizita.ev.on('connection.update',
      update => {
       // console.log(update);
          if (update.connection == 'close') {
            if (update.lastDisconnect.error.hasOwnProperty('output') ? update.lastDisconnect.error.output.statusCode != DisconnectReason.loggedOut: true) {
              console.log(bannerText("conexao fechada, reconectando...").string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.connectionLost) {
              console.log(bannerText("conexao com a internet foi perdida, reconectando...").string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.connectionReplaced) {
              console.log(bannerText("conexao substituida, reconectando...").string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.timedOut) {
              console.log(bannerText('tempo de conexao esgotado, reconectando...').string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
              console.log(bannerText('usuario desconectado, reconectando...').string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.badSession) {
              console.log(bannerText('sessao ruim, reconectando...').string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.restartRequired) {
              console.log(bannerText('reiniciamento exigido, reiniciando...').string);
              lolizitaStartIndex();
            } else if (update.lastDisconnect.error.output.statusCode == DisconnectReason.multideviceMismatch) {
              console.log(bannerText('icompatibilidade com varios dispositivos, reconectando...').string);
              lolizitaStartIndex();
            }
          } else if (update.connection == 'open') {
            console.log(banner.string);
            console.log(banner2.string);
            console.log(logs("Lolizita conectada."))
            for (let i of owner) lolizita.sendMessage(i, {
              text: mess.connected()
            });
          };
      });

    lolizita.ev.on('creds.update',
      saveState);

    // Remover participante do contador de mensagem
    const removeGroupParticipantMessageCount = (userId,
      groupId) => {
      const positionGp = _messageCount.groups.findIndex((obj) => obj.groupId === groupId);
      if (positionGp === -1) return;
      _messageCount.groups[positionGp].total -= _messageCount.groups[positionGp].users[userId] || 0;
      delete _messageCount.groups[positionGp].users[userId];
    };

    lolizita.ev.on('group-participants.update',
      async anu => {
        if (anu.action === 'remove') removeGroupParticipantMessageCount(anu.participants, anu.id);
        if (!welcome.includes(anu.id)) return
        try {
          let metadata = await lolizita.groupMetadata(anu.id)
          let participants = anu.participants
          for (let num of participants) {

            try {
              ppuser = await lolizita.profilePictureUrl(num, 'image')
            } catch {
              ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
            }

            try {
              ppgroup = await lolizita.profilePictureUrl(anu.id, 'image')
            } catch {
              ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
            }

            if (anu.action == 'add') {
              lolizita.sendMessage(anu.id, {
                image: {
                  url: ppuser
                }, contextInfo: {
                  mentionedJid: [num]}, caption: `Bem vindo(a) ${metadata.subject} @${num.split("@")[0]}`
              })
            } else if (anu.action == 'remove') {
              lolizita.sendMessage(anu.id, {
                image: {
                  url: ppuser
                }, contextInfo: {
                  mentionedJid: [num]}, caption: `@${num.split("@")[0]} Saiu do grupo; ${metadata.subject}`
              })
            }
          }
        } catch (err) {
          console.log("Err: ", color(err, "ref"))
        }
      })


    lolizita.ev.on('group-participants.update',
      async (m) => {
        if (antifake.includes(m.id)) {
          const data = await lolizita.groupMetadata(m.id)
          if (m.action == 'add') {
            num = m.participants[0]
            if (!num.split('@')[0].startsWith(55)) {
              lolizita.sendMessage(m.id, {
                text: "🗣️ Números fake não são permitido neste grupo, banindo número fake em 3 segundos..."
              });
              await sleep(3000);
              lolizita.groupParticipantsUpdate(m.id, [num], "remove")
            }
          }
        }
      })

    lolizita.ev.on('group-participants.update',
      async m => {
        try {
          ppuser = await lolizita.profilePictureUrl(num, 'image')
        } catch {
          ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
        }
        if (m.action == 'add') {
          if (antiListaNegra.find(value => value.group === m.id && value.numbers.includes(m.participants[0]))) {
            lolizita.sendMessage(m.id, {
              image: {
                url: ppuser
              }, contextInfo: {
                mentionedJid: [m.participants[0]]}, caption: `Membro: @${m.participants[0].split("@")[0]}.. Registrado na lista negra! Banindo...`
            })
            await sleep(1000);
            lolizita.groupParticipantsUpdate(m.id, [m.participants[0]], "remove");
          }
        }
      })

    lolizita.sendMessageButton = async(id,
      photo,
      teks) => {
      let message = await prepareWAMessageMedia(photo,
        {
          upload: lolizita.waUploadToServer
        });
      const template = generateWAMessageFromContent(id,
        proto.Message.fromObject({
          templateMessage: {
            hydratedTemplate: {
              imageMessage: message.imageMessage,
              hydratedContentText: teks,
              hydratedButtons: [{
                urlButton: {
                  displayText: 'Rest Apis ❄️',
                  url: api
                }},
                {
                  callButton: {
                    displayText: 'Dono 🌟',
                    phoneNumber: owner[0].split("@")[0]
                  }},
                {
                  quickReplyButton: {
                    displayText: 'Status Bot 🧝🏼‍♀️',
                    id: 'status'
                  }},
                {
                  quickReplyButton: {
                    displayText: `🌟〘Next: Proximo menu〙`,
                    id: mess.randomMenu()
                  }}]}}}),
        {
          userJid: id
        })
      lolizita.relayMessage(id,
        template.message,
        {
          messageId: template.key.id
        })
    }

    lolizita.templateMessage = async(jid,
      teks,
      buttons = [],
      quoted) => {
      lolizita.sendMessage(jid,
        {
          text: teks,
          footer: lolizita.user.name,
          buttonText: "Ler mais...",
          sections: buttons
        },
        quoted)
    }
 
      lolizita.sendMessageButtons = (id,
        text,
        imageId,
        buttons = []
      ) => {
        lolizita.sendMessage(id,
          {
            image: imageId,
            caption: text,
            buttons,
            headerType: 2
          });
      };

      lolizita.sendMessageButton1 = async (id,
        text,
        footer,
        img,
        buttons = [],
        options = {}) => {
        let message = await prepareWAMessageMedia(img,
          {
            upload: lolizita.waUploadToServer
          })
        var template = generateWAMessageFromContent(id,
          proto.Message.fromObject({
            templateMessage: {
              hydratedTemplate: {
                imageMessage: message.imageMessage,
                "hydratedContentText": text,
                "hydratedFooterText": footer,
                "hydratedButtons": buttons
              }
            }
          }),
          options)
        lolizita.relayMessage(id,
          template.message,
          {
            messageId: template.key.id
          })
      }

      lolizita.ws.on('CB:call',
        async (json) => {
          const callerId = json.content[0].attrs['call-creator']
          if (json.content[0].tag == 'offer') {
            lolizita.sendMessage(callerId, {
              text: `Bloqueio automático do sistema!\nNão ligue para o bot!\nEntre em contato com o proprietário para desbloquea-lo!`
            })
            await sleep(8000)
            await lolizita.updateBlockStatus(callerId, "block")
          }
        })

      lolizita.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi,
          ''): mime.split('/')[0]
        const stream = await downloadContentFromMessage(message,
          messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
      }

      lolizita.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg: message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, ''): mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext): filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
      }

      lolizita.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path: /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64'): /^https?:\/\//.test(path) ? await (await getBuffer(path)): fs.existsSync(path) ? fs.readFileSync(path): Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
          buffer = await writeExifImg(buff, options)
        } else {
          buffer = await imageToWebp(buff)
        }
        await lolizita.sendMessage(jid, {
          sticker: {
            url: buffer
          }, ...options
        }, {
          quoted
        })
        return buffer
      }

      lolizita.sendMessageJson = enviarJson = async(jid, text, mek) => {
        return lolizita.sendMessage(jid, {
          text: require('util').inspect(text)}, mek);
      }

      lolizita.ev.on('creds.update', () => saveState)
      return lolizita
    }

    lolizitaStartIndex().catch((err) => console.log("Error : %s", color(err, "red")));

    /**
    * Cretidos *
    *
    * adiwajshing | Baileys
    * Tobi | Criador
    * Lolizita | Comandos
    **/