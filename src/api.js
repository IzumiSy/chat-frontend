import RocketIO from 'rocket.io/rocketio.js'
import fetch from 'whatwg-fetch'
import If from 'ifx'

export const ERROR_TYPE = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  UNPROCESSABLE: 'UNPROCESSABLE',
  NOT_FOUND: 'NOT_FOUND',
  BAD_GATEWAY: 'BAD_GATEWAY',
  API_SERVER_ERROR: 'API_SERVER_ERROR'
}

const handleErrors = (res) => {
  if (res.ok) {
    return res
  }

  throw Error(
    If(res.status === 401)(() =>
      ERROR_TYPE.UNAUTHORIZED
    ).ElseIf(res.status === 400)(() =>
      ERROR_TYPE.INVALID_TOKEN
    ).ElseIf(res.status === 404)(() =>
      ERROR_TYPE.NOT_FOUND
    ).ElseIf(res.status === 422)(() =>
      ERROR_TYPE.UNPROCESSABLE
    ).ElseIf(res.status === 502)(() =>
      ERROR_TYPE.BAD_GATEWAY
    ).Else(() =>
      ERROR_TYPE.API_SERVER_ERROR
    )
  )
}

const opts = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}

const API_HOST = process.env.apiServerUrl

const fetchWithErrorHandling = (url, options) =>
  fetch(url, Object.assign({}, opts, options))
    .catch(() => { throw Error(ERROR_TYPE.NETWORK_ERROR) })
    .then(handleErrors)
    .then(res => res.json())

export default {
  pingRequest () {
    return fetchWithErrorHandling(`${API_HOST}/healthcheck`, {
      method: 'GET'
    })
  },

  createNewUser (name, face) {
    return fetchWithErrorHandling(`${API_HOST}/api/user/new`, {
      method: 'POST',
      body: JSON.stringify({
        name, face
      })
    })
  },

  patchUser (id, data) {
    return fetchWithErrorHandling(`${API_HOST}/api/user/${id}`, {
      method: 'POST',
      body: JSON.strinfigy({
        data
      })
    })
  },

  getAllRooms () {
    return fetchWithErrorHandling(`${API_HOST}/api/rooms`, {
      method: 'GET'
    })
  },

  getRoomUsers (roomId) {
    return fetchWithErrorHandling(`${API_HOST}/api/room/${roomId}/users`, {
      method: 'GET'
    })
  },

  userRoomEnter (roomId) {
    return fetchWithErrorHandling(`${API_HOST}/api/room/${roomId}/enter`, {
      method: 'POST'
    })
  },

  userRoomLeave (roomId) {
    return fetchWithErrorHandling(`${API_HOST}/api/room/${roomId}/leave`, {
      method: 'POST'
    })
  },

  sendMessage (roomId, message) {
    return fetchWithErrorHandling(`${API_HOST}/api/message/${roomId}`, {
      method: 'POST',
      body: JSON.strinfigy({
        content: message
      })
    })
  },

  connectRocketIO (roomId) {
    return (new RocketIO({
      type: 'comet',
      channel: roomId,
      ssl: (process.env.NODE_ENV === 'production')
    })).connect(API_HOST)
  }
}
