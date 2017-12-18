import 'bootstrap'
import 'nanoscroller'

import 'normalize-css'
import 'flat-ui/bootstrap/css/bootstrap.css'
import 'flat-ui/css/flat-ui.css'
import 'spinkit/css/spinkit.css'
import 'nanoscroller/bin/css/nanoscroller.css'
import './app.scss'

import Vue from 'vue'

import router from './routes.js'

new Vue({
  created () {
    router.mapRoutings()
    console.info('[APP] App created.')
  }
})
