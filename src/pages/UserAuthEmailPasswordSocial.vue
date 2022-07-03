<template>
  <div class="content-body">
    <div class="form-wrapper">
      <div class="bg-white">
        <h1 class="text-title">{{ apiConfig.authPageConfig.title }}</h1>
        <div class="field-group">
          <label class="label" for="txt-username">Username</label>
          <input
            class="input"
            type="text"
            id="txt-username"
            name="username"
            placeholder="Enter username"
            v-model="credentials.username"
          />
        </div>
        <div class="field-group">
          <label class="label" for="txt-password">Password</label>
          <input
            class="input"
            type="password"
            id="txt-password"
            name="password"
            placeholder="Enter password"
            v-model="credentials.password"
          />
        </div>
        <div class="field-group">
          <button
            :disabled="!isFormValid"
            :class="getClassForLoginButton()"
            @click="nativeLogin"
          >
            Login
          </button>
        </div>
        <div class="divider"></div>
        <div class="field-group">
          <div
            v-for="(item, key) in apiConfig.authPageConfig.recipe"
            :key="key"
          >
            <button-google
              v-if="item == 'google'"
              @click.native="bindClickForRecipe(item)"
            ></button-google>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// components
import ButtonGoogle from "../components/ButtonGoogle.vue";
import helper from "../helper";
export default {
  components: { ButtonGoogle },
  data: () => {
    return {
      credentials: {
        username: null,
        password: null,
      },
      recipe: {
        google: {
          class: "btn-submit btn-google mb-2",
          content: "Sign in with Google",
        },
      },
      apiConfig: {
        apiDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        authPageConfig: {
          title: "Login to Your App",
          recipe: ["google"],
        },
        style: {
          loginButtonClass: "btn-submit",
        },
      },
    };
  },
  methods: {
    getRecipe(key) {
      return this.recipe[key];
    },
    async bindClickForRecipe(recipe) {
      const getUrl = `${this.apiConfig.apiDomain}${this.apiConfig.apiBasePath}/authorisationurl?thirdPartyId=${recipe}`;
      let response = await this.$axios.get(getUrl, {
        method: "GET",
        headers: {
          rid: "thirdpartyemailpassword",
        },
      });

      let urlObj = new URL(response.data.url);
      urlObj.searchParams.append(
        "redirect_uri",
        `${window.location.href}/callback/${recipe}`
      );

      let url = urlObj.toString();
      window.location.href = url;
    },
    getClassForLoginButton() {
      let customClass = this.apiConfig.style.loginButtonClass;
      console.log("customClass", customClass);
      return [customClass ? customClass : "btn-submit"];
    },
    async nativeLogin() {
      helper.clearAuthCookies();
      console.log(this.credentials);
      // let  form = [
      //         {
      //           id: "firstname",
      //           label: "First Name",
      //           placeholder: "Jane",
      //         },
      //         {
      //           id: "lastname",
      //           label: "Last Name",
      //           placeholder: "Doe",
      //         },
      //         {
      //           id: "phone",
      //           label: "Phone",
      //           placeholder: "(123)456-7890",
      //           validate: (value) => {
      //             value = inputMask(value);
      //             // TODO: logic for checking input syntax
      //             return undefined;
      //           }
      //         },
      //       ],
      let loginResponse = await this.$axios.post('/auth/signin', this.credentials);
      console.log('loginResponse', loginResponse)
      // let isLoggedIn = await this.$vueSuperTokens.isLoggedIn();
      // console.log('isLoggedIn', isLoggedIn);
    },
  },
  async beforeMount() {
    helper.clearAuthCookies();
    console.log(this.$route.params.options);
    if (!this.$route.params.options) {
      this.$router.push({
        path: "/",
      });
    } else {
      this.apiConfig = this.$route.params.options;
      if (this.apiConfig.initDisplayStyle === "blank") {
        helper.showBody();
      }
    }
  },
  computed: {
    isFormValid() {
      return this.credentials.username && this.credentials.password;
    },
  },
};
</script>
<style scoped>
.btn-google {
  background-color: #4285f4 !important;
  border-radius: 2px;
  color: white;
  font-family: "Roboto";
}
.google-btn {
  background-color: #4285f4;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
}
.google-icon-wrapper {
  position: absolute;
  margin-top: 1px;
  margin-left: 1px;
  width: 40px;
  height: 40px;
  border-radius: 2px;
  background-color: #fff;
}
.google-icon {
  position: absolute;
  margin-top: 11px;
  margin-left: 11px;
  width: 18px;
  height: 18px;
}
.btn-text {
  float: right;
  margin: 11px 11px 0 0;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.2px;
  font-family: "Roboto";
}

.google-btn:hover {
  box-shadow: 0 0 6px #4285f4;
}

.google-btn:active {
  background: #1669f2;
}

@import url(https://fonts.googleapis.com/css?family=Roboto:500);

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

button,
input {
  overflow: visible;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: rgb(242, 245, 247);
  color: #4d5068;
  font-family: "Open Sans", sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.content-body {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-position-x: center;
  background-position-y: center;
  background-repeat: no-repeat;
  position: relative;
  background-size: 1100px;
}

@media screen and (max-width: 640px) {
  .content-body {
    background-position-y: top;
    background-size: 250px;
    margin-bottom: 5em;
  }
}

.form-wrapper {
  width: 350px;
  margin: 0 auto;
}

@media screen and (max-width: 640px) {
  .form-wrapper {
    margin-top: 200px;
  }
}

@media screen and (max-width: 480px) {
  .form-wrapper {
    width: 90%;
  }
}

.bg-white {
  width: 100%;
  background-color: #fff;
  border: 2px solid #e5e7ec;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 1em;
  text-align: center;
}

.text-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.field-group {
  border: 0;
  padding: 0.35em 0 0.625em 0;
  text-align: left;
  position: relative;
}

.label {
  font-size: 0.9rem;
  line-height: 1.5;
}

.input {
  padding: 0.5em 0 0.5em 1em;
  width: 100%;
  border: 1px solid #e5e7ec;
  border-radius: 5px;
  outline: 0;
  box-sizing: border-box;
}

.btn-submit {
  background-color: #e5c692;
  color: #fff;
  padding: 0.7em;
  border-radius: 5px;
  outline: 0;
  border: 0;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
}

.divider {
  width: 100%;
  height: 2px;
  background: #e5e7ec;
  margin-bottom: 2px;
}
</style>