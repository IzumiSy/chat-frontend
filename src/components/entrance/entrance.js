import $ from 'jquery'
import _ from 'underscore'
import Vue from 'vue'
import Bucks from 'bucks'

import utils from '../../utils.js'
import api from '../../api.js'
import shared from '../../shared.js'
import storage from '../../storage.js'

import './entrance.scss'

export default Vue.extend({
  template: require('./entrance.jade')(),

  data () {
    return {
      previousInput: null,
      resWaiting: true,
      currentView: 1,
      username: null,
      message: null,
      error: false,
      faces: []
    }
  },

  watch: {
    username () {
      this.previousInput = this.username
    }
  },

  ready () {
    api.pingRequest().then((res) => {
      this.resWaiting = false
      Vue.nextTick(() => {
        $(this.$el).find('input.login-field').focus()
      })
    }, () => {
      shared.jumpers.error()
    })

    console.info('[APP] Entrance ready.')
  },

  methods: {
    attrFaceAsset: utils.attrFaceAsset,

    setError (msg) {
      if (msg === null) {
        this.error = false
        this.message = ''
      } else {
        this.error = true
        this.message = msg
      }
    },

    selectFace (face) {
      this.currentView = 3
      api.createNewUser(this.username, face).then((res) => {
        if (!res.data.room_id) {
          // TODO Better to show an error detail here
          console.warn('Response data does not have room_id')
          shared.jumpers.error()
          return
        }
        storage.set('token', res.data.token)
        shared.data.currentRoomId = res.data.room_id.$oid
        shared.data.user = res.data
        shared.jumpers.root()
      }).catch((res) => {
        shared.jumpers.error()
        console.error(res)
      })
    },

    enterRobby () {
      if (!this.username) {
        this.setError('ログインネームを入力してください')
        return
      }

      // Vue.js catches enter with IME on, so to prevent this,
      // here checks the previous input data with the current one.
      if (this.username === this.previousInput) {
        this.entranceTransaction()
      }
    },

    entranceTransaction () {
      var username = this.username

      const checkDuplication = (_next) => {
        return api.isNameDuplicated(username).then((res) => {
          if (res.data && res.data.status) {
            return _next(new Error('ユーザー名が使われています'))
          }
          return _next()
        }).catch((res) => {
          console.error(res)
          return _next(new Error('システムエラー'))
        })
      }

      const setUserFace = (_next) => {
        this.faces = _.sample(shared.FACE_ASSETS, 3)
        this.currentView = 2
        return _next()
      }

      Bucks.onError((e, bucks) => {
        this.resWaiting = false
        if (e.message) {
          this.setError(e.message)
        } else {
          shared.jumpers.error()
        }
      })

      this.setError(null)
      this.resWaiting = true

      const bucks = new Bucks()
      bucks.then((res, next) => {
        this.message = 'ユーザ名が使えるかチェックしています...'
        checkDuplication(next)
      }).then((res, next) => {
        setUserFace(next)
        this.resWaiting = false
      }).end()
    }
  }
})
