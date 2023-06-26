import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store';
import '../src/assets/css/font_4139054_e7e8kq29zri/iconfont.css'
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
