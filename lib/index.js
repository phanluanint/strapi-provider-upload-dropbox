'use strict'
const url = require('url')
const { Dropbox } = require('dropbox')
const fetch = require('node-fetch')

// replace dropbox download url for direct link
const dropBoxResultUrlRegularExpression = /www.dropbox.com/
const dropBoxDownloadUrl = 'dl.dropboxusercontent.com'

module.exports = {
  init(providerOptions) {
    // init your provider if necessary
    const dbx = new Dropbox({ accessToken: providerOptions.accessToken, fetch })

    return {
      upload(file) {
        return new Promise((resolve, reject) => {
          // upload the file in the provider
          dbx.filesUpload({
            path: `/uploads/${file.hash}${file.ext}`,
            contents: file.buffer
          })
            .then(dropboxFile => dbx.sharingCreateSharedLinkWithSettings({ path: dropboxFile.path_display }))
            .then(sharedFile => {
              const { protocol, hostname, pathname } = url.parse(sharedFile.url)
              file.public_id = sharedFile.id
              file.url = url.format({
                protocol,
                hostname: hostname.replace(dropBoxResultUrlRegularExpression, dropBoxDownloadUrl),
                pathname
              })
              return resolve()
            })
            .catch(err => {
              reject(err)
            })
        })
      },
      delete(file) {
        // delete the file in the provider
        return new Promise((resolve, reject) => {
          dbx.filesDeleteV2({ path: `/uploads/${file.hash}${file.ext}` })
            .then(() => resolve())
            .catch(err => reject(err))
        })
      }
    }
  }
}
