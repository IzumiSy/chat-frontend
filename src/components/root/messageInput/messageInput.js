import $ from 'jquery'
import Vue from 'vue'
import api from '../../../api.js'
import shared from '../../../shared.js'

export default {
  template: require('./_message_input.jade')(),

  data () {
    return {
      message: null,
      resWaiting: false,
      networkError: false,
      previousInput: null
    }
  },

  watch: {
    message () {
      this.previousInput = this.message
    }
  },

  computed: {
    placeholdingText () {
      return (
        this.networkError
          ? 'ネットワークエラーがおきています...'
          : 'メッセージを入力...'
      )
    }
  },

  created () {
    this.$on('app:msgInput:setFocus', () => {
      this.setInputFocus()
    })
    this.$on('app:msgInput:networkError', () => {
      this.networkError = true
    })
    this.$on('app:msgInput:networkConnected', () => {
      this.networkError = false
    })

    console.info('[APP] Message input ready')
  },

  ready () {
    this.setInputFocus()
  },

  methods: {
    setInputFocus () {
      $(this.$el).find('input.message').focus()
    },

    async sendMessage () {
      // Prevention for mis-enter with IME on
      if (this.message !== this.previousInput) {
        return
      }

      const message = this.message
      const currentRoomId = shared.data.currentRoomId

      if (!currentRoomId) {
        console.warn('Error: currentRoomId is undefined or invalid.')
        return
      }

      try {
        this.resWaiting = true
        await api.sendMessage(currentRoomId, message)
        this.$set('message', null)
        this.$dispatch('app:root:newMessage')
        this.resWaiting = false
        Vue.nextTick(() => {
          $(this.$el).find('input.message').focus()
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
