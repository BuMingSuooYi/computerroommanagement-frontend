<template>
    <el-breadcrumb separator='/'>
<!--        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
 -->        <el-breadcrumb-item v-for='(item, index) in breadcrumbItems'
                            :key='index'
                            :to='item.route'>
            {{ item.title }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    data() {
        return {
            breadcrumbItems: []  // 用于存储动态的面包屑项
        };
    },
    created() {
        // 在组件创建时，根据当前路由路径更新面包屑内容和激活的菜单项
        this.updateBreadcrumb();
    },
    watch: {
        // 监听路由变化，更新面包屑内容和激活的菜单项
        $route() {
            this.updateBreadcrumb();
        }
    },
    methods: {
        updateBreadcrumb() {
            const matchedRoutes = this.$route.matched;
            this.breadcrumbItems = matchedRoutes.map(route => ({
                title: route.meta.title, // 面包屑项的显示文本，可根据实际情况配置
                route: { path: route.path } // 面包屑项的路由链接
            }));
        }
    }
};
</script>

<style scoped>
.el-breadcrumb {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    line-height: 70px;
    height: 70px;
}

/deep/ span.el-breadcrumb__inner.is-link {
    color: white !important;
}
</style>
