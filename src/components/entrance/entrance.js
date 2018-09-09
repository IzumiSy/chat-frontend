import _ from 'underscore'
import Vue from 'vue'
import api from '../../api.js'
import shared from '../../shared.js'
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
    async submit () {
      this.currentView = 2
      this.waiting = true

      try {
        const face = _.sample(shared.FACE_ASSETS)
        const user = await api.createNewUser(this.username, face)

        shared.data.currentRoomId = user.room_id.$oid
        shared.data.user = user
        shared.jumpers.root()
      } catch (e) {
        console.error(e)

        this.currentView = 1
        this.waiting = false
        this.error = '入室できませんでした。'
      }
    }
  }
})
