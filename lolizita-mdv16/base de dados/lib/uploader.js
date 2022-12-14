let axios = require('axios')
let BodyForm = require('form-data')
let {
  fromBuffer
} = require('file-type')
let fetch = require('node-fetch')
let fs = require('fs')
let cheerio = require('cheerio')

function telegraph(Path) {
  return new Promise (async (resolve, reject) => {
    if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
    try {
      const form = new BodyForm();
      form.append("file", fs.createReadStream(Path))
      const data = await axios({
        url: "https://telegra.ph/upload", method: "POST", headers: {
          ...form.getHeaders()}, data: form
      })
      return resolve("https://telegra.ph" + data.data[0].src)
    } catch (err) {
      return reject(new Error(String(err)))
    }
  })
}

function webp2mp4File(path) {
  return new Promise((resolve, reject) => {
    const form = new BodyForm()
    form.append('new-image-url', '')
    form.append('new-image', fs.createReadStream(path))
    axios({
      method: 'post',
      url: 'https://s6.ezgif.com/webp-to-mp4',
      data: form,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`
      }
    }).then(({
        data
      }) => {
      const bodyFormThen = new BodyForm()
      const $ = cheerio.load(data)
      const file = $('input[name="file"]').attr('value')
      bodyFormThen.append('file', file)
      bodyFormThen.append('convert', "Convert WebP to MP4!")
      axios({
        method: 'post',
        url: 'https://ezgif.com/webp-to-mp4/' + file,
        data: bodyFormThen,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
        }
      }).then(({
          data
        }) => {
        const $ = cheerio.load(data)
        const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
        resolve({
          status: true,
          message: "Created By MRHRTZ",
          result: result
        })
      }).catch(reject)
    }).catch(reject)
  })
}

module.exports = {
  telegraph,
  webp2mp4File
}