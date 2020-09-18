# strapi-provider-upload-dropbox

Dropbox upload provider for Strapi

## Installation
```
npm install strapi-provider-upload-dropbox --save
````
or 
```
yarn add strapi-provider-upload-dropbox
````


Go to https://www.dropbox.com/developers/apps and create an app and generate an Access token


Create or edit the file at `./config/plugins.js` and configure it using your Dropbox App's Access token

```
module.exports = ({ env }) => ({
  upload: {
    provider: 'dropbox',
    providerOptions: {
      accessToken: "<Your Dropbox Access token here>",
    },
  },
});
```


## Compatibility
Tested on Strapi v3.1.5 — Community Edition


## License

The MIT License (MIT)

Copyright (c) 2020 Luan Phan
