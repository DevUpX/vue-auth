import { IVueAuthLogin, IVueAuthOptions, IVueAuthRegister } from "../interfaces";
import AuthVueRouter from "./router";
import AuthStoreManager from "./store-manager";
import AuthVueHttp from "./http";
import { Vue } from "vue/types/vue";

export interface IAuthOptions extends IVueAuthOptions {
    Vue: Vue;
}

export const DEFAULT_OPTIONS: IVueAuthOptions = {
    authMeta: "auth",
    authRedirect: "/login",
    fetchData: {
        interval: 30,
        method: "GET",
        url: "/auth/user",
    },
    fetchItem: "",
    headerTokenReplace: "{auth_token}",
    loginData: {
        fetchUser: false,
        method: "POST",
        redirect: "/",
        url: "/auth/login",
    },
    logoutData: {
        makeRequest: false,
        method: "POST",
        redirect: "/login",
        url: "/auth/logout",
    },
    refreshData: {
        enabled: false,
        interval: 30,
        method: "GET",
        url: "/auth/refresh",
    },
    registerData: {
        fetchUser: false,
        method: "POST",
        redirect: "/",
        url: "/auth/register",
    },
    tokenDefaultName: "default_auth_token",
    tokenName: {
        accessName: "access_token",
        refreshName: "refresh_token",
    },
    tokenType: "Bearer",
    userDefaultName: "default_auth_user",
    vuexStoreSpace: "vue-auth",
};

export default class Auth {
    private readonly options = {} as IAuthOptions;
    private readonly http: AuthVueHttp;
    private readonly storeManager: AuthStoreManager;

    constructor(private readonly VueInstance: any, options: IVueAuthOptions = {} as IVueAuthOptions) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
            Vue: new this.VueInstance({
                data() {
                    return {
                        token: null,
                        user: null,
                    };
                },
            }),
        };
        this.storeManager = new AuthStoreManager(this.VueInstance, this.options);
        const router = new AuthVueRouter(this.VueInstance, this.options, this.storeManager);
        this.http = new AuthVueHttp(this.VueInstance, this.options, this.storeManager, router);
    }

    public login(loginInfo: IVueAuthLogin) {
        return this.http.login(loginInfo);
    }

    public register(registerData: IVueAuthRegister) {
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

    public authorization() {
        return {
            headers: {
                Authorization: 'Bearer ' + this.accessToken()
            }
        }
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
