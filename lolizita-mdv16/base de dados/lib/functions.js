const {
  default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState,
    downloadContentFromMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    proto
  } = require('@adiwajshing/baileys');

  const {
    prefixo,
    owner,
    compreSuaApikey,
    api,
    logo
  } = require('../../configure aqui.js');

  // Arquivos
  const {
    color
  } = require('../../base de dados/lib/color');

  const {
    linguagem,
    mess
  } = require('../../base de dados/database/menu');

  const fetch = require('node-fetch')
  const axios = require('axios')
  const fs = require('fs')
  const {
    tmpdir
  } = require("os")
  const Crypto = require("crypto")
  const ff = require('fluent-ffmpeg')
  const webp = require("node-webpmux")
  const path = require("path")

  // togif
  let BodyForm = require('form-data')
  let {
    fromBuffer
  } = require('file-type')
  let cheerio = require('cheerio')

  const getGroupAdmins = (participants) => {
    admins = [];
    for (let i of participants) {
      i.isAdmin ? admins.push(i.jid): '';
    }
    return admins;
  };

  // Remody tobi
  const getBuffer = (url, options) => new Promise(async (resolve, reject) => {
    options ? options: {}
    await axios({
      method: "get", url, headers: {
        'DNT': 1, 'Upgrade-Insecure-Request': 1
      }, ...options, responseType: 'arraybuffer'
    }).then((res) => {
      resolve(res.data)
    }).catch(reject);
  });

  const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
    fetch(url, options).then(response => response.json()).then(json => {
      resolve(json)
    }).catch(reject);
  })

  const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
  }

  const mimetype = require('mime-types')
  const getExtension = async (type) => {
    return await mimetype.extension(type)
  }

  const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
  }

  const getFileBuffer = async (mediakey, MediaType) => {
    const stream = await downloadContentFromMessage(mediakey, MediaType)
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }

  async function imageToWebp (media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)
    fs.writeFileSync(tmpFileIn, media)
    await new Promise((resolve, reject) => {
      ff(tmpFileIn)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
      .toFormat("webp")
      .save(tmpFileOut)
    })

    const buff = fs.readFileSync(tmpFileOut)
    fs.unlinkSync(tmpFileOut)
    fs.unlinkSync(tmpFileIn)
    return buff
  }

  const readMore = `\u{200b}`.repeat(3073)

  const runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " dia, ": " dias, "): "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hora, ": " horas, "): "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, ": " minutos, "): "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo": " segundos"): "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  function togif(path) {
    return new Promise((resolve, reject) => {
      const form = new BodyForm()
      form.append('new-image-url', '')
      form.append('new-image', fs.createReadStream(path))
      axios({
        method: 'post', url: 'https://s6.ezgif.com/webp-to-mp4', data: form, headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }}).then(({
          data
        }) => {
        const bodyFormThen = new BodyForm()
        const $ = cheerio.load(data)
        const file = $('input[name="file"]').attr('value')
        bodyFormThen.append('file', file)
        bodyFormThen.append('convert', "Convert WebP to MP4!")
        axios({
          method: 'post', url: 'https://ezgif.com/webp-to-mp4/' + file, data: bodyFormThen, headers: {
            'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
          }}).then(({
            data
          }) => {
          const $ = cheerio.load(data)
          const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
          resolve({
            status: true, result: result
          })
        }).catch((err) =>
          reject({
            message: "Slakkk"
          }))
      }).catch(reject)
    })
  }

  module.exports = {
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
  }