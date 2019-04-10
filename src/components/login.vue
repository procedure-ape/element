<template>
  <div class="login">
    <background></background>
    <div id="loging-form">
      <div class="formBox">
        <div><img src="../../static/test.png" alt=""></div>

        <transition class="formBox" name="fade">
          <div v-if="login.show" class="formBox" @keydown.13="logins">
            <div class="user_input">
              <i class="fa fa-user"></i>
              <input id="_username" class="username" type="text" v-model="login.username">
            </div>
            <div class="user_input">
              <i class="fa fa-lock"></i>
              <input id="_password" class="password" type="password" v-model="login.password">
            </div>
            <div class="msg">
              {{ login.msg }}
            </div>
            <div class="user_submit" @click="logins">
              登录
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div class="formBox" v-if="lisence.show" @keydown.13="lisences">
            <div class="user_input">
              <i class="fa fa-qrcode"></i>
              <input id="_username" class="username" type="text" v-model="lisence.code" disabled>
            </div>
            <div class="user_input">
              <i class="fa fa-key"></i>
              <input id="_password" class="password" v-model="lisence.key">
            </div>
            <div class="msg">
              {{ lisence.msg }}
            </div>
            <div class="user_submit" @click="lisences">
              认证
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script>
  import background from './background'
  import axiosHttp from '../util/request'
  import axios from 'axios'

  export default {
    name: 'login',
    data() {
      return {
        login: {
          show: true,
          username: '',
          password: '',
          msg: ''
        },
        msg: '',
        lisence: {
          show: false,
          code: '获取主机认证码中。。。',
          key: '',
        }
      }
    },
    mounted: function () {
      axios.get('/login/checkcode')
        .then((res) => {
          switch (res.data.error_num) {
            case 0:
              this.login.show = true
            case 1:
              this.lisence.msg = res.data.msg
              this.lisence.show = true
            case 2:
              this.lisence.msg = res.data.msg
              this.lisence.show = true
            case 3:
              // this.login.show = false
              // this.lisence.msg = res.data.msg
              // this.lisence.show = true
              // this.getCode()

          }
        })
    },
    components: {
      background,
    },
    methods: {
      logins: function () {
        // 直接登录
        axios.post('/login/userlogin', {
            username: this.login.username,
            password: this.login.password
          })
          .then((res) => {
            switch (res.data.error_num) {
              case 0:
                sessionStorage.setItem('userstate', this.login.username)
                this.$router.push('home')
              case 1:
                this.msg = res.data.msg

              default:
                this.msg = '未知错误'
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      lisences: function () {
        axios.post('/login/keephostcode', {
            code: this.lisence.key
          })
          .then((res) => {
            if (res.data.error_num == 0) {
              this.lisence.show = false
              this.login.show = true
            }
          })
      },

      getCode: function () {
        axios.get('/login/gethostcode')
          .then((res) => {
            this.lisence.code = res.data.data
          })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    height: 100%;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  #loging-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .formBox {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .formBox div {
    margin: 10px;
  }

  .formBox input {
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
  }

  .user_input {
    border-bottom: solid 2px #fff;
  }

  .user_input i {
    color: #fff;
    font-size: 22px;
    margin: 5px 0;
  }

  .user_input input {
    padding: 3px;
  }

  .user_submit {
    border: solid 2px #fff;
    padding: 5px 25px;
    color: #fff;
    cursor: pointer;
  }

  .msg {
    color: #fff;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s ease 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>