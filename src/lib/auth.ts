import { VueAuthLogin, VueAuthOptions, VueAuthRegister } from '../interfaces';
import AuthVueRouter from './router';
import AuthStoreManager from './store-manager';
import AuthVueHttp from './http';
import { Vue } from 'vue/types/vue';

export interface IVueAuthOptions extends VueAuthOptions {
    Vue: Vue;
}

export const DEFAULT_OPTIONS: VueAuthOptions = {
    authMeta: 'auth',
    tokenDefaultName: 'default_auth_token',
    userDefaultName: 'default_auth_user',
    headerTokenReplace: '{auth_token}',
    tokenType: 'Bearer',
    vuexStoreSpace: 'vue-auth',
    tokenName: {
        accessName: 'access_token',
        refreshName: 'refresh_token'
    },
    authRedirect: '/login',
    loginData: {
        url: '/auth/login',
        method: 'POST',
        redirect: '/',
        fetchUser: false,
    },
    registerData: {
        url: '/auth/register',
        method: 'POST',
        redirect: '/',
        fetchUser: false,
    },
    logoutData: {
        url: '/auth/logout',
        method: 'POST',
        redirect: '/login',
        makeRequest: false,
    },
    fetchItem: '',
    fetchData: {
        url: '/auth/user',
        method: 'GET',
        interval: 30
    },
    refreshData: {
        url: '/auth/refresh',
        method: 'GET',
        interval: 30,
        enabled: false,
    }
};

export default class Auth {
    private readonly options = {} as IVueAuthOptions;
    private readonly http: AuthVueHttp;
    private readonly storeManager: AuthStoreManager;

    constructor(private readonly VueInstance: any, options: VueAuthOptions = {} as VueAuthOptions) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
            Vue: new this.VueInstance({
                data() {
                    return {
                        user: null,
                        token: null,
                    };
                },
            }),
        };
        this.storeManager = new AuthStoreManager(this.VueInstance, this.options);
        const router = new AuthVueRouter(this.VueInstance, this.options, this.storeManager);
        this.http = new AuthVueHttp(this.VueInstance, this.options, this.storeManager, router);
    }

    public login(loginInfo: VueAuthLogin) {
        return this.http.login(loginInfo);
    }

    public register(registerData: VueAuthRegister) {
        return this.http.register(registerData);
    }

    public logout() {
        return this.http.logout();
    }

    public check(): boolean {
        return this.storeManager.check();
    }

    public user() {
        return this.storeManager.getUser();
    }

    public accessToken() {
        return this.storeManager.getAccessToken();
    }

    public refreshToken() {
        return this.storeManager.getRefreshToken();
    }

    public fetchUser() {
        return this.http.fetchData();
    }

    public refresh() {
        return this.http.refresh(true);
    }

}
