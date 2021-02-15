# :key: Vue Auth Plugin

A simple authentication and authorization library for Vue.js using typescript.

This project is inspired by [@d0whc3r/vue-auth-plugin](https://github.com/d0whc3r/vue-auth-plugin), the reason I rewrite this plugin, is to standardize auth method.

Pull requests and issues are welcome

### Features

- Support of refreshToken

- Standard use of browser storage: sessionStorage for accessToken and localStorage for refreshToken

- No cookieStorage

# :notebook: Note

Server should return
```
{
    "access_token": "thetoken",
    "refresh_token": "thetoken"
}
```
access and refresh token's names can be customized.

Cannot customize fetchData methods anymore.

# :rocket: Install

```bash
npm install -S @devupx/vue-auth
```

# :notebook: Documentation and Usage

[https://vue-auth-plugin.netlify.app](https://vue-auth-plugin.netlify.app)

Note:

- Some options have been changed

- Role has been remove, because we can find out user's role in user info after fetch user data.

Example of options:
```
{
  authMeta: 'auth',
  tokenDefaultName: 'default_auth_token',
  userDefaultName: 'default_auth_user',
  headerTokenReplace: '{auth_token}',
  tokenType: 'Bearer',
  vuexStoreSpace: 'vue-auth', // vuex store name
  authRedirect: '/login', // page when you need
  tokenName: { // tokens' name
    accessName: 'access_token',
    refreshName: 'refresh_token'
  },
  loginData: {
    url: '/auth/login',
    method: 'POST',
    redirect: undefined,
    fetchUser: true // enable to fetch user info after login
  },
  registerData: {
    url: '/auth/register',
    method: 'POST',
    redirect: undefined,
    fetchUser: true // enable to fetch user info after register
  },
  logoutData: { redirect: '/login' },
  fetchData: { url: '/auth/me', method: 'GET', interval: 30 }, // fetch user info every [interval] minutes
  refreshData: { // refresh access_token every [interval] minutes
    url: '/auth/refresh',
    method: 'GET',
    interval: 30,
    enabled: true
  }
}
```

# Next step

Standardize role methods in router meta.

# :copyright: License

> Plugin created using [vue-cli 4](https://cli.vuejs.org/) and [p11n plugin](https://github.com/kazupon/vue-cli-plugin-p11n)

[MIT](http://opensource.org/licenses/MIT)

# :bookmark: Keywords

`vue`, `auth`, `authorization`, `authentication`, `login`, `vuejs`, `vue2`, `typescript`
