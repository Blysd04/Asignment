const mongoose = require('mongoose')

class Mongo {
  constructor() {
    this._connect()
  }

  _connect() {
    const env = process.env.NODE_ENV
    let URI = ''
    if (env === 'dev') {
      URI = process.env.MONGODB_URI_DEV
    }
    mongoose.connect(URI).then(() => {
      console.log('Database connection successful!');
    }).catch(err => {
      console.error('Database connection error!');
    })
  }
}

module.exports = new Mongo()