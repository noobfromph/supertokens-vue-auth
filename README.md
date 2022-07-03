# supertokens-vue-auth
Vuejs implementation of the Supertokens Library
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### Usage
```
import Vue from 'vue';

// in main.js or in a plugin
import { SuperTokens } from 'supertokens-vue-auth';

let superTokens = new SuperTokens();
Vue.use(superTokens, {
    apiDomain: process.env.VUE_APP_API_DOMAIN,
    apiBasePath: process.env.VUE_APP_AUTH_PATH,
    websiteBasePath: process.env.VUE_APP_WEB_SITE_BASE_PATH
});

new Vue({
  superTokens,
  render: h => h(App),
}).$mount('#app')

// to access anymore
this.vueSuperTokens

Function isLoggedIn - returns true if currently logged-in
Function getUserId - returns user id
Function signOut - performs signout and redirect to login page
```
