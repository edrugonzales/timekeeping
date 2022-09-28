import request from 'utils/header'
const sign_in_email = (email, password) => request.post('/login', { email, password })

const sign_in_phone = (phone) => request.post('/phone', { phone: phone })

const sign_up_phone = (phone, store_id) => request.post('/phone/signup', { phone: phone, company: store_id })

const verify_phone = (_id, code) => request.post(`/phone/verify/${_id}`, { code })

const google_login = () => request.get('/google')

const facebook_login = () => request.get('/facebook')

const sign_out = () => request.post('/signout')

const _expObject = {
  google_login,
  facebook_login,
  sign_in_email,
  sign_in_phone,
  sign_up_phone,
  verify_phone,
  sign_out,
}
export default _expObject
