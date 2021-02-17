import { VueConstructor } from "vue";
import { VueAuthLocalStorage } from "../../interfaces";
import { IAuthOptions } from "../auth";

export default class StoreLocalStorage extends VueAuthLocalStorage {
    constructor(Vue: VueConstructor, options: IAuthOptions) {
        super(Vue, options);
        this.store = window.localStorage;
        this.initVue();
    }

    public getRefreshToken(): string {
        return this.store.getItem(this.options.tokenDefaultName);
    }

    public setRefreshToken(token: string | null): void {
        if (token) {
            this.store.setItem(this.options.tokenDefaultName as string, token);
        } else {
            this.store.removeItem(this.options.tokenDefaultName);
        }
    }
}
