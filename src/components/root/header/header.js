import api from '../../../api.js'
import shared from '../../../shared.js'
import storage from '../../../storage.js'

export default {
  template: require('./_header.jade')(),

  methods: {
    logout () {
      api.userRoomLeave('all')
      storage.remove('token')
      shared.jumpers.entrance()
    }
  }
}
