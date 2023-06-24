<template>
    <div class='login-wrap'>
        <div class='ms-login'>
            <div class='ms-title'>学院机房上机管理系统</div>
            <el-form :model='param' :rules='rules' ref='login' label-width='80px' class='ms-content'>
                <el-form-item prop='username' label='用户名'>
                    <el-input v-model='param.username' placeholder='请输入用户名'>
                    </el-input>
                </el-form-item>
                <el-form-item prop='password' label='密码'>
                    <el-input
                        show-password
                        type='password'
                        placeholder='password'
                        v-model='param.password'
                        @keyup.enter.native='submitForm()'
                    >
                    </el-input>
                </el-form-item>
                <el-form-item prop='type' label='人员类型'>
                    <el-select v-model='param.type' placeholder='请选择人员类型'>
                        <el-option value='0' label='系统管理员'></el-option>
                        <el-option value='1' label='机房管理员'></el-option>
                        <el-option value='2' label='学生'></el-option>
                    </el-select>

                </el-form-item>
                <div class='login-btn'>
                    <el-button type='primary' @click='submitForm()'>登录</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/basic/account';

export default {
    data: function() {
        return {
            param: {
                username: '',
                password: '',
                type: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                type: [{ required: true, message: '请选择人员类型', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    login(this.param).then(res => {
                        if (res.code === 200) {
                            localStorage.setItem('account', JSON.stringify(res.data));
                            this.$message.success('登录成功');
                            this.$router.push('/');
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch(err => {
                        this.$message.error('请求出错了：' + err);
                    });
                } else {
                    this.$message.error('请输入账号、密码以及人员类型');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    height: 100%;
    background-color: #324156;
    background-size: 100%;
    align-items: center;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.3);
    height: 320px;
    width: 450px;
    border-radius: 6px;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}


</style>
