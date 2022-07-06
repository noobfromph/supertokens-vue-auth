import supertokens from 'supertokens-website';
import axios from 'axios';

import helper from './helper';

let _axiosInit = false;
let axiosInstance = axios.create();
// axios instance
export class Axios {
    install(Vue, options) {
        Vue.mixin({
            created() {
                if (_axiosInit) return;
                _axiosInit = true;
                axiosInstance = axios.create(options || {});
                Vue.prototype.$axios = axiosInstance;
            }
        });
    }
}

// supertokens axios
supertokens.addAxiosInterceptors(axiosInstance);

// options
let currentOptions = {
    strict: true,
    initDisplayStyle: 'blank', // screen display for initialization, values: circular|linear animation style,
    apiDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
    authPageConfig: {
        title: 'Login to MCGI App',
        recipe: ['google']
    },
    style: {
        loginButtonClass: 'btn-submit'
    }
};

let isInit = false;
let router = null;

export class SuperTokens {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        // create a mixin
        Vue.mixin({
            beforeCreate() {
                if (isInit) return;

                isInit = true;

                // init supertokens
                supertokens.init(options);
                router = this.$router;

                if (options.strict != null) {
                    currentOptions.strict = options.strict;
                }

                currentOptions.initDisplayStyle = options.initDisplayStyle != null ?  options.initDisplayStyle : currentOptions.initDisplayStyle;
                // hide body content when initialization
                if (currentOptions.initDisplayStyle === 'blank') {
                    helper.hideBody();
                }

                // url configs
                currentOptions.apiDomain = options.apiDomain != null ? options.apiDomain : currentOptions.apiDomain;
                currentOptions.apiBasePath = options.apiBasePath != null ? options.apiBasePath : currentOptions.apiBasePath;
                currentOptions.websiteBasePath = options.websiteBasePath != null ? options.websiteBasePath : currentOptions.websiteBasePath;

                // custom configs
                currentOptions.authPageConfig = options.authPageConfig != null ? options.authPageConfig : currentOptions.authPageConfig;
                currentOptions.style = options.style != null ? options.style : currentOptions.style;
                
                // custom supertokens functions
                let superTokens = {
                    isLoggedIn: function() {
                        return supertokens.doesSessionExist();
                    },
                    getUserId: function() {
                        return supertokens.getUserId();
                    },
                    signOut: async function() {
                        await supertokens.signOut();
                        helper.clearAuthCookies(); // clear cookies
                        // redirect to /auth
                        router.push({
                            name: 'auth',
                            params: {
                                options: currentOptions
                            }
                        });
                    }
                };

                // add to Vue, can be access as this.$vueSuperTokens in all components
                Vue.prototype.$vueSuperTokens = superTokens;

                // add the custom authentication page
                this.$router.addRoutes([
                    {
                        path: currentOptions.websiteBasePath,
                        name: 'auth',
                        component: () => import('./pages/UserAuthEmailPasswordSocial.vue')
                    }
                ]);

                // check if the user is authenticated
                // or if registration
                checkSession(router);
            },
            watch: {
                $route (to){
                    if (to.path === currentOptions.websiteBasePath) return;
                    
                    supertokens.doesSessionExist().then(signedIn => {
                        if (!signedIn) {
                            router.push({
                                name: 'auth',
                                params: {
                                    options: currentOptions
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

function createUser({ code, redirectURI, thirdPartyId }) {
    let postUrl = `${currentOptions.apiDomain}${currentOptions.apiBasePath}/signinup`;
    let headers = {
        "rid": "thirdpartyemailpassword",
        'Content-Type': 'application/json'
    };

    let body = JSON.stringify({
        code: code,
        redirectURI: redirectURI,
        thirdPartyId: thirdPartyId
    });

    return axiosInstance.post(postUrl, body, { headers: headers });
}

async function checkSession(router) {
    let code = new URL(window.location.href).searchParams.get('code');
    if (code != null) {
        let postConfig = {
            code: code,
            redirectURI: `${window.location.origin}/callback/google`,
            thirdPartyId: 'google'
        }
        // create user
        await createUser(postConfig).catch(err => console.error(err));
        // go to home page
        router.push({
            path: '/'
        });
        helper.showBody();
    } else {
        let isLoggedIn = await supertokens.doesSessionExist();
        if (!isLoggedIn) {
            router.push({
                name: 'auth',
                params: {
                    options: currentOptions
                }
            });
        } else {
            helper.showBody();
        }
    }
}
