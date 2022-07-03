import Vue from 'vue'
import App from './App.vue'

import { SuperTokens }from './install';

let superTokens = new SuperTokens();
Vue.use(superTokens, {
    apiDomain: process.env.VUE_APP_API_DOMAIN,
    apiBasePath: process.env.VUE_APP_AUTH_PATH,
    websiteBasePath: process.env.VUE_APP_WEB_SITE_BASE_PATH
});

Vue.config.productionTip = false

new Vue({
  superTokens,
  render: h => h(App),
}).$mount('#app')
