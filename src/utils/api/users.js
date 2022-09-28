import request from 'utils/header'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const axios = require('axios').default;
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Manila')

// const get_users = (_type) =>
//   request
//     .get('/users')
//     .then((users) => {
//       let newUser = []
//       if (!users.data) return newUser

//       users.data.map((v, k) => {
//         if (v.role !== _type) return ''
//         if (v.firstName === null || v.lastName === null) return ''
//         return newUser.push({...v})
//       })

//       return {
//         ok: true,
//         data: newUser,
//       }
//     })
//     .catch((err) => {
//       return {ok: false, data: err}
//     })

const get_user = (_id) => request.get(`/user/${_id}`)

const create_new_password = () => request.get(`/user/generate/password`)

const validate_password = (_id) => request.get(`/user/validate/password/${_id}`)

const get_limited_users = (_id) => request.get(`/user/limited/records/${_id}`)

const get_limited_usersV2 = () => request.get(`/user/limited/recordsV2`)

const get_record_by_id = _id => request.get(`/record/${_id}`)

const delete_record_by_id = _id => request.get(`/record/delete/${_id}`)

const delete_last_record_by_id = _id => request.get(`/record/delete/last/${_id}`)

const update_record_by_id = (_id, _data) => request.patch(`/record/update/${_id}`, _data)

const get_users_bydate = (_id, _date) => request.get(`/user/records/bydate/${_id}/${_date}`)

const get_users = (_id) => request.get(`/store/users/${_id}`)

const get_users_archived = (_id) => request.get(`/store/users/archive/${_id}`)

const post_store_register = (_data) => request.post(`/store/register`, _data)

const post_employee_register = (_data) => request.post(`/employee/register`, _data)

const patch_store_onboard = (_data, _id) => request.patch(`/user/store/${_id}`, _data)

const get_user_status = (_id) => request.get(`/user/status/${_id}`)

const post_user_status = (_status, _location, _id, _previous) => {
  const date = dayjs().tz('Asia/Manila').utc().format()
  return request.post(`/user/time/${_id}`, { status: _status, location: _location, logdate: date, previous: _previous })
}
const post_user_workmate_status = (_status, _location, _id, _previous, _workmate) => {
  const date = dayjs().tz('Asia/Manila').utc().format()
  return request.post(`/user/workmate_time/${_id}`, { status: _status, location: _location, logdate: date, previous: _previous, workmate: _workmate })
}
const remove_user = (_id, _uid) => request.delete(`/store/${_id}/user/${_uid}`)

const archive_user = (_id, _uid) => request.get(`/store/${_id}/user/${_uid}/archive`)

const restore_user = (_id, _uid) => request.get(`/store/${_id}/user/${_uid}/restore`)

const patch_user_onboard = (_data, _id) => request.patch(`/user/${_id}`, _data)

const get_user_records = (_id) => request.get(`/user/records/${_id}`)

const get_user_records_range = (_id, _date) =>
  request.get(`/user/records/${_id}/${_date}`)

/*const get_user_records_range_v2 = (_id, _startDate, _endDate) =>
  request.get(`/user/recordsv2/${_id}/${_startDate}/${_endDate}`)*/

const get_user_records_range_v2 = (_id, _startDate, _endDate) =>
  axios.get(`https://time-in-production-api.onrender.com/api/user/recordsv2/${_id}/${_startDate}/${_endDate}`)

const get_day_quote = () => request.get(`https://type.fit/api/quotes`)

const post_branch = (form_data) => request.post('/store/branch', form_data);

const post_store_distance = (_location) => request.post('/user/storedistance', _location);

const get_user_branch = (_id) => request.get(`/store/branch/${_id}`);

const patch_user_location = (_id, _data) => request.patch(`/user/updateStore/${_id}`, _data);

const get_user_locationv1 = () => request.get(`https://ipapi.co/json/`);

const get_user_ip = () => request.get(`http://ipwho.is/`);

const get_user_company = () => request.get(`/users/company`);

const get_record_bystore = (_store, _date) => request.get(`/store/records/${_store}/${_date}`);

const update_user_password = (_id, _password) => request.get(`/user/updatePass/${_id}/${_password}`);

const get_user_locationv2 = () => request.get(`https://ipapi.co/json/?key=HVywqXALKicFBIeVM2FDoZGwIvVQ3Ys0RtHTH4Cw67P6O2zoOY`);

const get_storyblok_version = () => request.get(`https://api.storyblok.com/v1/cdn/spaces/announcement?version=published&token=cTyDJj4G8trQivtm2BFmpQtt`);

const get_storyblok_banners = (version) => request.get(`https://api.storyblok.com/v1/cdn/stories/announcement?version=published&token=cTyDJj4G8trQivtm2BFmpQtt&cv=${version.data.space.version}`);

const get_store_location = (company) => request.post('/store/user', company); 

const _expObject = {
  get_user,
  get_users,
  get_users_archived,
  post_store_register,
  post_employee_register,
  patch_store_onboard,
  get_user_status,
  post_user_status,
  patch_user_onboard,
  get_user_records,
  get_user_records_range,
  get_day_quote,
  remove_user,
  archive_user,
  restore_user,
  post_branch,
  get_user_branch,
  post_user_workmate_status,
  get_user_records_range_v2,
  patch_user_location,
  get_user_locationv1,
  get_user_locationv2,
  get_user_ip,
  get_limited_users,
  get_users_bydate,
  create_new_password,
  validate_password,
  get_limited_usersV2,
  get_record_by_id,
  delete_record_by_id,
  delete_last_record_by_id,
  update_record_by_id,
  get_user_company,
  get_record_bystore,
  update_user_password,
  post_store_distance,
  get_store_location,
  get_storyblok_banners,
  get_storyblok_version
}

export default _expObject