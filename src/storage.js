import shared from './shared.js'

// If the browse does not support localStorage
// storage module wraps straging with shared.js module

export default {
  isAvailable () {
    return window.sessionStorage
      ? true : (() => {
        shared.data.storageData = []
        return false
      })()
  },

  set (key, value) {
    return window.sessionStorage
      ? window.sessionStorage.setItem(key, value)
      : (() => {
        shared.data.storageData[key] = value
        return { key: key, value: value }
      })()
  },

  get (key) {
    return window.sessionStorage
      ? window.sessionStorage.getItem(key)
      : shared.data.storageData[key]
  },

  remove (key) {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(key)
    } else {
      delete shared.data.storageData[key]
    }
  }
}
