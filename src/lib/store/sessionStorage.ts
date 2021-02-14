import { VueConstructor } from 'vue';
import {AuthUser, VueAuthSessionStorage} from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreSessionStorage extends VueAuthSessionStorage {
    constructor(Vue: VueConstructor, options: IVueAuthOptions) {
        super(Vue, options);
        this.store = window.sessionStorage;
        this.initVue();
    }

    public getAccessToken(): string {
        return this.store.getItem(this.options.tokenDefaultName);
    }

    public setAccessToken(token: string | null): void {
        if (token) {
            this.store.setItem(this.options.tokenDefaultName as string, token);
        } else {
            this.store.removeItem(this.options.tokenDefaultName);
        }
    }

    public getUser(): AuthUser {
        return JSON.parse(this.store.getItem(this.options.userDefaultName));
    }

    public setUser(user: AuthUser | null): void {
        if (user && Object.keys(user)) {
            this.store.setItem(this.options.userDefaultName as string, JSON.stringify(user));
        } else {
            this.store.removeItem(this.options.userDefaultName);
        }
    }
}
