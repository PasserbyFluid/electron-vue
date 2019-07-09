import { login, logout, getInfo,reg } from '@/api/login'
import { getToken, setToken, removeToken,setPower,removePower ,setName,getPower,removeName,getName} from '@/utils/auth'
import { resetRouter } from '@/router'
const user = {
  state: {
    token: getToken(),
    name: getName(),
	avatar: '',
	power:getPower(),
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
	},
	SET_POWER: (state, avatar) => {
		state.power = avatar
	  },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), passwd: password }).then(response => {
          // const data = .data
          commit('SET_TOKEN', response.msg.id)
          setToken(response.msg.id)
          setPower(response.msg.power)
          setName(response.msg.name)
          commit('SET_NAME', response.msg.name)
          commit('SET_AVATAR', 'avatar')
          console.log(11111)
          console.log(response)
          // setToken(data.token)
          commit('SET_POWER', response.msg.power)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    reg({ commit }, userInfo) {
		console.log(userInfo)
      const { name, password, type } = userInfo
      return new Promise((resolve, reject) => {
        reg({ name: name.trim(), password: password , type:type}).then(response => {
          console.log(response)
          // const { data } = response
          // commit('SET_TOKEN', response.msg.id)
          // setToken(response.msg.id)
          // setPower(response.msg.power)
          // commit('SET_NAME', 'name')
          // commit('SET_AVATAR', 'avatar')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
	resetToken({ commit }) {
		return new Promise(resolve => {
		  commit('SET_TOKEN', '')
		  removeToken()
		  removePower()
		  resetRouter()
		  removeName()
		  resolve()
		})
	  },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
