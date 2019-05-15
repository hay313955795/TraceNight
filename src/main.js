import Vue from 'vue'
import store from './store/'
import ElementUI from 'element-ui'
import './assets/css/style.scss'
import router from './router/'
import Config from './config/app'
import {isLogin} from './utils/dataStorage'
import App from './App.vue'
Vue.prototype.$Config = Config;

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title?to.meta.title+'-'+Config.siteName:Config.siteName;

  console.log(to.path);
  console.log(isLogin());
  if (to.path === '/login'&& isLogin() ) {
    console.log(isLogin());
    next({path: '/'});
  }

  if (!isLogin() && to.path != '/login') {
    next({path: '/login'});
  } else {
    next();
  }
});
router.afterEach(transition => {

});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
