import _ from 'underscore'
import Vue from 'vue'

import api from '../../api.js'
import shared from '../../shared.js'
import storage from '../../storage.js'

import './entrance.scss'

export default Vue.extend({
  template: require('./entrance.jade')(),

  data () {
    return {
      username: null,
      currentView: 1,
      waiting: false,
      error: null
    }
  },

  methods: {
    submit () {
      this.currentView = 2
      this.waiting = true

      const face = _.sample(shared.FACE_ASSETS)
      api.createNewUser(this.username, face).then((res) => {
        console.log(res)
        if (!res.data.room_id) {
          console.warn('Response data does not have room_id')
          shared.jumpers.error()
          return
        }
        storage.set('token', res.data.token)
        shared.data.currentRoomId = res.data.room_id.$oid
        shared.data.user = res.data
        shared.jumpers.root()
      }).catch((res) => {
        this.currentView = 1
        this.waiting = false
        this.error = '入室できませんでした。'
      })
    }
  }
})
