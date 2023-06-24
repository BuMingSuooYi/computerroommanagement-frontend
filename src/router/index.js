import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

Vue.use(Router);
// 配置解决 Avoided redundant navigation to current location
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
        meta: { title: '首页' },
        children: [
            {
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                meta: { title: '系统首页' }
            },
            {
                path: '/myComputerRecord',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/MyComputerRecord/index.vue'),
                meta: { title: '上机记录' }
            },
            // 基础数据管理
            {
                path: '/account',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/basic/account/index.vue'),
                meta: { title: '用户管理' }
            },
            {
                path: '/section',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/basic/section/index.vue'),
                meta: { title: '节次管理' }
            },
            // 学生管理
            {
                path: '/student',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/student/index.vue'),
                meta: { title: '学生管理' }
            },
            // 机房管理
            {
                path: '/machineroom',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/MachineRoom/MachineRoom/index.vue'),
                meta: { title: '机房管理' }
            },
            {
                path: '/rejectRecord',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/MachineRoom/RejectRecord/index.vue'),
                meta: { title: '开放管理' }
            },
            {
                path: '/machineRoomDetail',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/MachineRoom/MachineRoomDetail/index.vue'),
                meta: { title: '机房机位管理' }
            },
            // 电脑管理
            {
                path: '/computer',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/computer/computer/index.vue'),
                meta: { title: '电脑管理' }
            },
            {
                path: '/maintenanceRecord',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/computer/MaintenanceRecord/index.vue'),
                meta: { title: '维修管理' }
            },
            {
                path: '/computerConfiguration',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/computer/ComputerConfiguration/index.vue'),
                meta: { title: '配置管理' }
            },
            // 上机管理
            {
                path: '/boardComputer',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/embarkation/BoardComputer/index.vue'),
                meta: { title: '上机管理' }
            },
            {
                path: '/boardComputerDetail',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/embarkation/BoardComputerDetail/index.vue'),
                meta: { title: '上机机位管理' }
            },
            {
                path: '/computerRecord',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/embarkation/computerRecord/index.vue'),
                meta: { title: '上机记录' }
            },
            {
                path: '/clazzPeriod',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/embarkation/clazzPeriod/index.vue'),
                meta: { title: '学时管理' }
            },
            // 系统管理
            {
                path: '/loginLog',
                component: () => import(/* webpackChunkName: "table" */ '../components/page/system/LoginLog/index.vue'),
                meta: { title: '日志管理' }
            },
            // 权限管理
            {
                // 权限页面
                path: '/permission',
                component: () => import(/* webpackChunkName: "permission" */ '../components/page/permission/Permission.vue'),
                meta: { title: '权限测试', permission: true }
            },
            {
                path: '/404',
                component: () => import(/* webpackChunkName: "404" */ '../components/page/permission/404.vue'),
                meta: { title: '404' }
            },
            {
                path: '/403',
                component: () => import(/* webpackChunkName: "403" */ '../components/page/permission/403.vue'),
                meta: { title: '403' }
            }
        ]
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '*',
        redirect: '/404'
    }

];

const router = new Router({
    mode: 'history', // 去除路径#
    base: process.env.BASE_URL,
    routes
});

//使用钩子函数对路由进行权限跳转

router.beforeEach((to, from, next) => {
    // 开始进度条
    NProgress.start();
    document.title = `${to.meta.title} | vue-manage-admin`;
    const account = localStorage.getItem('account');

    if (!account && to.path !== '/login') {
        next('/login');
        NProgress.done();
        this.$message.info('请登录');
    } else if (to.meta.permission) {
        const type = JSON.parse(localStorage.getItem('account')).type;
        let role = '';
        if (type === 0) {
            role = 'admin';
        } else if (type === 1) {
            role = 'roomAdmin';
        } else if (type === 2) {
            role = 'student';
        }

        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
        NProgress.done();
    } else {

        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
            NProgress.done();
        }
    }
});

export default router;
