import shared from '../../../shared.js'
import api from '../../../api.js'
import utils from '../../../utils.js'

import './sidebar.scss'

export default {
  template: require('./_sidebar.jade')(),

  data () {
    return {
      rooms: [],
      users: [],

      currentUser: null,
      currentRoomId: null,
      currentFace: null,
      networkError: false,

      // Here will be updated right after curretnRoomId is set
      // from message dispatching of root controller.
      nowLoading: true
    }
  },

  created () {
    this.listenersSetup()
    this.$set('currentUser', shared.data.user)
  },

  ready () {
    if (shared.data.user && shared.data.user.face) {
      this.currentFace = utils.attrFaceAsset(shared.data.user.face)
    }
    console.info('[APP] Sidebar ready.')
  },

  // RocketIO subscribers for user leave/enter are always called on
  // even when the current user leaves from the chat.
  // so sidebar event listeners have to be "off"ed before elements destroy.
  beforeDestroy () {
    this.$off()
  },

  methods: {
    listenersSetup () {
      this.$once('app:sidebar:setCurrentRoom', (roomId) => {
        this.$set('currentRoomId', roomId)
        this.nowLoading = false
      })

      this.$on('app:sidebar:updateRooms', (data) => {
        this.$set('rooms', data)
      })
      this.$on('app:sidebar:updateUsers', (data) => {
        this.$set('users', data)
      })

      this.$on('app:sidebar:networkError', () => {
        this.networkError = true
      })
      this.$on('app:sidebar:networkConnected', () => {
        this.networkError = false
      })
    },

    onRoomClicked (room) {
      if (this.networkError || this.nowLoading) {
        return
      }

      var currentRoomId = shared.data.currentRoomId
      var nextRoomId = room._id.$oid

      if (nextRoomId === currentRoomId) {
        return
      }

      shared.data.currentRoomId = nextRoomId
      this.$set('currentRoomId', nextRoomId)
      this.$set('users', [])
      this.nowLoading = true

      this.$dispatch('app:root:roomChange')

      // userRoomLeave doesnt have to be called here.
      // because userRoomEnter updates current room data to the new one.

      // This dispater cannot be asynchronizing, because
      // app:root:fetchRoomData needs waiting for update of user list in backend.
      api.userRoomEnter(nextRoomId).then((res) => {
        this.$dispatch('app:root:fetchRoomData', nextRoomId)
        this.nowLoading = false
      }, () => {
        console.warn(`Error at api.userRoomEnter: Id(${nextRoomId})`)
      })
    },

    // roomItemClasses returns v-bind:class contents for its own,
    // because Jade cannot use new linings in double-quoted attributes.
    roomItemClasses (room) {
      return {
        current: (this.currentRoomId === room._id.$oid),
        disabled: this.networkError || this.nowLoading
      }
    },

    userItemClasses () {
      return {
        disabled: this.networkError || this.nowLoading
      }
    }
  }
}
