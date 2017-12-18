import $ from 'jquery'
import Vue from 'vue'
import shared from '../../../shared.js'

module.exports = {
  template: require('./_message_view.jade')(),

  data () {
    return {
      messages: []
    }
  },

  ready () {
    this.listenersSetup()
    console.info('[APP] Message view ready.')
  },

  methods: {
    // If 'messages' parameter is given, this method substitutes that messages
    // to shared data as current room messages. If not, this just loads messages
    // of current room and return them.
    populateRoomMessages (messages) {
      var currentRoomId = shared.data.currentRoomId
      var currentRoomMessages = []

      if (currentRoomId) {
        if (messages !== undefined && $.isArray(messages)) {
          shared.data.channelMessages[currentRoomId] = messages
          return messages
        }

        currentRoomMessages = shared.data.channelMessages[currentRoomId]
        if (!currentRoomMessages) {
          shared.data.channelMessages[currentRoomId] = []
          currentRoomMessages = []
        }
      }

      return currentRoomMessages
    },

    roomChange () {
      this.$set('messages', this.populateRoomMessages())
    },

    addMessage (data) {
      var messages = this.$get('messages')
      messages.push(data)
      this.$set('messages', this.populateRoomMessages(messages))
      Vue.nextTick(this.scrollToBottom)
    },

    scrollToBottom () {
      // TODO Handle scroll
    },

    listenersSetup () {
      this.$on('app:msgView:roomChange', () => {
        this.roomChange()
      })
      this.$on('app:msgView:addMessage', (data) => {
        this.addMessage(data)
      })
      this.$on('app:msgView:scrollBottom', () => {
        this.scrollToBottom()
      })
    },

    isPrevUserSame (index) {
      var messages = this.$get('messages')
      var isSame = false

      if (index > 0) {
        isSame = (messages[index - 1].user_id.$oid === messages[index].user_id.$oid)
      }

      return isSame
    }
  }
}
