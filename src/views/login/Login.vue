<template>
    <div class="login">
<!-- 星空背景
        <div class='solar-syst'>
            <div class='sun'></div>
            <div class='mercury'></div>
            <div class='venus'></div>
            <div class='earth'></div>
            <div class='mars'></div>
            <div class='jupiter'></div>
            <div class='saturn'></div>
            <div class='uranus'></div>
            <div class='neptune'></div>
            <div class='pluto'></div>
            <div class='asteroids-belt'></div>
        </div>-->
        <div class="login-form">
            <div class="login-header">
                <img src="../../assets/images/logo.svg" width="100" height="100" alt="">
                <p>{{ $Config.siteName }}</p>
            </div>
            <el-input
                    placeholder="请输入用户名"
                    suffix-icon="fa fa-user"
                    v-model="userNmae"
                    style="margin-bottom: 18px"
            >
            </el-input>

            <el-input
                    placeholder="请输入密码"
                    suffix-icon="fa fa-keyboard-o"
                    v-model="password"
                    type="password"
                    style="margin-bottom: 18px"
                    @keyup.native.enter="login"
            >
            </el-input>

            <el-button
                    type="primary" :loading="loginLoading"
                    style="width: 100%;margin-bottom: 18px"
                    @click.native="login"
            >登录
            </el-button>
            <div>
                <el-checkbox v-model="Remenber"> Remenber</el-checkbox>
                <a href="javascript:;" style="float: right;color: #3C8DBC;font-size: 14px">Register</a>
            </div>
        </div>

    </div>
</template>

<script>
    import {setToken} from '../../utils/dataStorage'
    import {login as loginApi} from '../../api/user'

    export default {
        data() {
            return {
                userNmae: '',
                password: '',
                Remenber: true,
                loginLoading: false
            }
        },
        methods: {
            login() {
                this.loginLoading = true;
                loginApi({username: this.userNmae, password: this.password}).then(r => {
                    setToken(r.data);
                    this.$notify({
                        title: '登录成功',
                        message: '很高兴你使用TraceNightAdmin！',
                        type: 'success'
                    });
                    this.loginLoading = false;
                    this.$router.push({path: '/'});
                }).catch(_ => {
                    this.loginLoading = false;
                });


            }
        }
    }
</script>

<style lang="scss">
    @import "Login.scss";
  //  @import "Star.scss";

</style>
