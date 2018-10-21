import Vue from 'vue'

import api from '../../api.js'
import shared from '../../shared.js'
import rocketio from '../../rocketio.js'

import header from './header/header.js'
import sidebar from './sidebar/sidebar.js'
import messageView from './messageView/messageView.js'
import messageInput from './messageInput/messageInput.js'

import './root.scss'

export default Vue.extend({
  template: require('./root.jade')(),

  components: {
    'va-header': header,
    'va-sidebar': sidebar,
    'va-message-view': messageView,
    'va-message-input': messageInput
  },

  data () {
    return {
      rooms: [],
      msgListener: null
    }
  },

  created () {
    this.listenersSetup()
    console.info('[APP] Root created.')
  },

  ready () {
    if (!shared.data.user) {
      shared.jumpers.entrance()
      return
    }
    this.roomDataSetup(shared.data.currentRoomId)
    console.info('[APP] Root ready.')
  },

  methods: {
    roomDataSetup (roomId) {
      this.$broadcast('app:sidebar:setCurrentRoom', roomId)
      this.fetchUsersAndMessages(roomId)
      rocketio.setupRocketIOListeners(this, roomId)
    },

    fetchUsersAndMessages (roomId) {
      api.getAllRooms().then(rooms => {
        this.$broadcast('app:sidebar:updateRooms', rooms)
        shared.data.rooms = rooms
      }, () => {
        console.warn('Error at api.getAllRooms')
      })
      api.getRoomUsers(roomId).then(roomUsers => {
        this.$broadcast('app:sidebar:updateUsers', roomUsers)
        shared.data.currentRoomUsers = roomUsers
      }, () => {
        console.warn('Error at api.getRoomUsers')
      })
    },

    listenersSetup () {
      this.$on('app:root:fetchRoomData', (roomId) => {
        this.roomDataSetup(roomId)
      })
      this.$on('app:root:newMessage', () => {
        this.$broadcast('app:msgView:scrollBottom')
      })
      this.$on('app:root:roomChange', () => {
        this.$broadcast('app:msgView:roomChange')
        this.$broadcast('app:msgInput:setFocus')
      })
    }
  }
})
