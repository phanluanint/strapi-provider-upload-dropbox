'use strict'
const url = require('url')
const Dropbox = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')
const dropBoxResultUrlRegularExpression = /www.dropbox.com/;
const dropBoxDownloadUrl = 'dl.dropboxusercontent.com'

module.exports = {
  provider: 'dropbox',
  name: 'Dropbox',
  auth: {
    accessToken: {
      label: 'Access Token',
      type: 'text'
    }
  },
  init: config => {
    const dbx = new Dropbox({ accessToken: config.accessToken, fetch })
    return {
      upload: file => {
        return new Promise((resolve, reject) => {
          dbx.filesUpload({ path: `/uploads/${file.hash}${file.ext}`, contents: Buffer.from(file.buffer, 'binary') })
            .then(uploadedFile => dbx.sharingCreateSharedLinkWithSettings({ path: uploadedFile.path_display }))
            .then(fileUrl => {
              console.log(fileUrl);
              const { protocol, hostname, pathname } = url.parse(fileUrl.url)
              file.public_id = fileUrl.id
              file.url = url.format({
                protocol,
                hostname: hostname.replace(dropBoxResultUrlRegularExpression,dropBoxDownloadUrl),
                pathname,
                query: {
                  raw: 1
                }
              })
             
               return resolve()
            })
            .catch(function (err) {
              return reject(err)
            })
        })
      },
      delete: file => {
        return new Promise((resolve, reject) => {
          dbx.filesDelete({path: `/uploads/${file.hash}${file.ext}`})
            .then(() => resolve())
            .catch(err => reject(err))
        })
      }
    }
  }
}