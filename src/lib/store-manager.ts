import { VueConstructor } from "vue";
import { IAuthUser, VueAuthStore } from "../interfaces";
import { StoreLocalStorage, StoreSessionStorage, StoreVuex } from "./store";
import { IAuthOptions } from "./auth";

export default class AuthStoreManager extends VueAuthStore {
    private sessionStore?: StoreSessionStorage;
    private localStore?: StoreLocalStorage;
    private vuexStore?: StoreVuex;

    constructor(Vue: VueConstructor, options: IAuthOptions) {
        super(Vue, options);
        this.setStores();
        this.options.Vue.$watch("user", (value) => {
            this.setUser(value);
        });
        this.options.Vue.$watch("accessToken", (value) => {
            this.setAccessToken(value);
        });
        this.options.Vue.$watch("refreshToken", (value) => {
            this.setRefreshToken(value);
        });
    }

    public setStores() {
        this.sessionStore = new StoreSessionStorage(this.Vue, this.options);
        this.localStore = new StoreLocalStorage(this.Vue, this.options);
        this.vuexStore = new StoreVuex(this.Vue, this.options);
    }

    public getAccessToken(): string {
        const token = this.vuexStore?.getAccessToken() || this.sessionStore?.getAccessToken();
        return token || this.options.Vue.$data.access_token;
    }

    public getRefreshToken(): string {
        const token = this.vuexStore?.getRefreshToken() ||  this.localStore?.getRefreshToken();
        return token || this.options.Vue.$data.refresh_token;
    }

    public getUser(): IAuthUser {
        const user = this.vuexStore?.getUser() || this.sessionStore?.getUser();
        return user || this.options.Vue.$data.user;
    }

    public setAccessToken(token: string | null): void {
        this.options.Vue.$data.access_token = token;
        this.vuexStore?.setAccessToken(token);
        this.sessionStore?.setAccessToken(token);
    }

    public setRefreshToken(token: string | null): void {
        this.options.Vue.$data.refresh_token = token;
        this.vuexStore?.setRefreshToken(token);
        this.localStore?.setRefreshToken(token);
    }

    public setUser(user: IAuthUser | null): void {
        this.options.Vue.$data.user = user;
        this.vuexStore?.setUser(user);
        this.sessionStore?.setUser(user);
    }

    public resetAll(): void {
        this.options.Vue.$data.user = null;
        this.options.Vue.$data.access_token = null;
        this.options.Vue.$data.refresh_token = null;
        this.setUser(null);
        this.setAccessToken(null);
        this.setRefreshToken(null);
    }

    public check(): boolean {
        return !!this.getUser();
    }
}
