import Cookies from 'js-cookie'

const TokenKey = 'uid'

export function getToken() {
  return localStorage.getItem(TokenKey)
}
export function getPower() {
  return localStorage.getItem('power')
}
export function getName() {
  return localStorage.getItem('name')
}
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}
export function setPower(power) {
  return localStorage.setItem('power', power)
}
export function setName(name) {
  return localStorage.setItem('name', name)
}
export function removePower() {
  return localStorage.removeItem('power')
}
export function removeName() {
  return localStorage.removeItem('name')
}
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
