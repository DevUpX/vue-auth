import { VueConstructor } from 'vue';
import { VueAuthLocalStorage } from '../../interfaces';
import { IVueAuthOptions } from '../auth';

export default class StoreLocalStorage extends VueAuthLocalStorage {
    constructor(Vue: VueConstructor, options: IVueAuthOptions) {
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
