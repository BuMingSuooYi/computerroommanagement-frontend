<template>
    <div class='sidebar'>
        <div class='logo' :class="{'logo-collapse':collapse}">
            <img :src='logo' class='sidebar-logo' alt='logo' />
            <div :class="{'title-collapse':collapse}" class='sidebar-title'>{{ title }}</div>
        </div>
        <el-menu
            class='sidebar-el-menu'
            :default-active='onRoutes'
            :collapse='collapse'
            background-color='#324157'
            text-color='#bfcbd9'
            active-text-color='#20a0ff'
            unique-opened
            router
        >
            <template v-for='item in items'>
                <template v-if='item.subs'>
                    <el-submenu v-if='hasPermission(item.role)' :index='item.index' :key='item.index'>
                        <template slot='title'>
                            <i :class='item.icon'></i>
                            <span slot='title'>{{ item.title }}</span>
                        </template>
                        <template v-for='subItem in item.subs'>
                            <el-submenu
                                v-if='subItem.subs&&hasPermission(subItem.role)'
                                :index='subItem.index'
                                :key='subItem.index'>
                                <template slot='title'>{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for='(threeItem,i) in subItem.subs'
                                    :key='i'
                                    :index='threeItem.index'
                                >{{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else-if='hasPermission(subItem.role)'
                                :index='subItem.index'
                                :key='subItem.index'
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item v-if='hasPermission(item.role)' :index='item.index' :key='item.index'>
                        <i :class='item.icon'></i>
                        <span slot='title'>{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '@/utils/bus';
import logoImg from '@/assets/logo.png';

export default {
    data() {
        return {
            title: '通用管理系统',
            logo: logoImg,
            collapse: false,
            // 路由
            items: [
                {
                    icon: 'el-icon-s-home',
                    index: 'dashboard',
                    title: '系统首页',
                    role: ['admin', 'roomAdmin', 'student']
                },
                {
                    icon: 'el-icon-date',
                    index: '1',
                    title: '基础数据管理',
                    role: ['admin', 'roomAdmin'],
                    subs: [
                        {
                            index: 'account',
                            title: '用户管理',
                            role: ['admin', 'roomAdmin']
                        },
                        {
                            index: 'section',
                            title: '节次管理',
                            role: ['admin', 'roomAdmin']
                        }
                    ]
                },
                {
                    icon: 'el-icon-date',
                    index: 'student',
                    title: '学生管理',
                    role: ['admin', 'roomAdmin']
                },
                {
                    icon: 'el-icon-date',
                    index: '2',
                    title: '机房管理',
                    role: ['admin', 'roomAdmin'],
                    subs: [
                        {
                            index: 'machineRoom',
                            title: '机房管理',
                            role: ['admin', 'roomAdmin']
                        },
                        {
                            index: 'rejectRecord',
                            title: '开放管理',
                            role: ['admin', 'roomAdmin']
                        }
                    ]
                },
                {
                    icon: 'el-icon-date',
                    index: '3',
                    title: '电脑管理',
                    subs: [
                        {
                            index: 'computer',
                            title: '电脑管理',
                            role: ['admin', 'roomAdmin']
                        },
                        {
                            index: 'maintenanceRecord',
                            title: '维修管理',
                            role: ['admin', 'roomAdmin']
                        },
                        {
                            index: 'computerConfiguration',
                            title: '配置管理',
                            role: ['admin', 'roomAdmin']
                        }
                    ]
                },
                {
                    icon: 'el-icon-date',
                    index: '4',
                    title: '上机管理',
                    role: ['roomAdmin'],
                    subs: [
                        {
                            index: 'boardComputer',
                            title: '上机管理',
                            role: ['roomAdmin']
                        },
                        {
                            index: 'computerRecord',
                            title: '上机记录',
                            role: ['roomAdmin']
                        },
                        {
                            index: 'clazzPeriod',
                            title: '学时管理',
                            role: ['roomAdmin']

                        }
                    ]
                },
                {
                    icon: 'el-icon-date',
                    index: '5',
                    title: '系统管理',
                    role: ['admin'],
                    subs: [
                        {
                            index: 'loginLog',
                            title: '登录日志',
                            role: ['admin']
                        }
                    ]
                },
                {
                    icon: 'el-icon-thumb',
                    index: '6',
                    title: '错误处理',
                    subs: [
                        {
                            index: 'permission',
                            title: '权限测试',
                            role: ['admin', 'roomAdmin', 'student']
                        },
                        {
                            index: '404',
                            title: '404页面',
                            role: ['admin', 'roomAdmin', 'student']
                        },
                        {
                            index: '403',
                            title: '403页面',
                            role: ['admin', 'roomAdmin', 'student']
                        }
                    ]
                },
                {
                    icon: 'el-icon-coffee-cup',
                    index: '/myComputerRecord',
                    title: '上机记录',
                    role: ['student']
                }
                // {
                //     icon: 'el-icon-coffee-cup',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ],
            currentRole: ''
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        const type = JSON.parse(localStorage.getItem('account')).type;
        let role = '';
        if (type === 0) {
            role = 'admin';
        } else if (type === 1) {
            role = 'roomAdmin';
        } else if (type === 2) {
            role = 'student';
        }
        this.currentRole = role;
    },
    methods: {
        hasPermission(roles) {
            if (roles === undefined) {
                return false;
            }
            return roles.includes(this.currentRole);
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    transition: right .3s ease-in-out;
}

.sidebar .logo {
    display: flex;
    width: 220px;
    height: 70px;
    line-height: 70px;
    background-color: #324157;
    transition: .3s;
    align-items: center;
    justify-content: center;
}

.sidebar-logo {
    width: 40px;
    height: 40px;
    margin-right: 5px;
    transition: .3s;
}

.sidebar-title {
    font-size: 20px;
    color: white;
    line-height: 70px;
    transition: .3s;
}

.sidebar-title.title-collapse {
    display: none;
    transition: .3s;
}

.logo.logo-collapse {
    width: 65px;
    transition: .3s;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 220px;
}

.sidebar > ul {
    height: 100%;
    overflow-y: scroll;
}

.sidebar > ul::-webkit-scrollbar {
    width: 0;
}
</style>
