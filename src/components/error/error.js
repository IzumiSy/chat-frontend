import shared from '../../shared.js'
import storage from '../../storage.js'

import './error.scss'

export default {
  template: require('./error.jade')(),

  created () {
    storage.remove('token')
  },

  methods: {
    reload () {
      shared.jumpers.entrance()
    }
  }
}
