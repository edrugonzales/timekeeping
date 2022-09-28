import {create} from 'apisauce'
import authStorage from './storage'
// import cache from './cache'

//const base_url = 'https://6ae4-136-158-8-125.ngrok.io/api'
//const base_url = process.env.REACT_APP_API_URL
const base_url = 'https://sparkle-time-keep.herokuapp.com/api'
//const base_url = 'https://time-in-production-api.onrender.com/api'

const apiClient = create({
  baseURL: base_url,
})

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken()
  if (!authToken) return
  request.headers['Authorization'] = `Bearer ${authToken}`
})

// const get = apiClient.get
// apiClient.get = async (url, params, axiosConfig) => {
//   const response = await get(url, params, axiosConfig)

//   if (response.ok) {
//     cache.store(url, response.data)
//     return response
//   }

//   const data = await cache.get(url)
//   return data ? {ok: true, ...data} : response
// }

export default apiClient
