<template>
    <div class='wrapper'>
        <top-header></top-header>
        <side-bar></side-bar>
        <div class='content-box' :class="{'content-collapse':collapse}">
            <tags-view></tags-view>
            <div class='content'>
                <transition name='move' mode='out-in'>
                    <keep-alive :include='tagsList'>
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target='.content'></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import TopHeader from '@/components/TopHeader/index.vue';
import SideBar from '@/components/Sidebar/index.vue';
import TagsView from '@/components/TgasView/index.vue';
import bus from '@/utils/bus';

export default {
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        TopHeader,
        SideBar,
        TagsView
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    }
};
</script>
