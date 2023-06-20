import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 配置解决 Avoided redundant navigation to current location
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    mode: 'history', // 去除路径#
    routes: [
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
                    meta: { title: '状态管理' }
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
    ]
});
