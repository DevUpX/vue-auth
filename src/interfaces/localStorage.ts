import { IAuthOptions } from "../lib/auth";

interface IVueAuthLocalStorage {
    getRefreshToken(): string;
    setRefreshToken(token: string): void;
}

export abstract class VueAuthLocalStorage implements IVueAuthLocalStorage {
    protected store: any;

    protected constructor(protected Vue: any, protected options: IAuthOptions) {
    }

    public abstract getRefreshToken(): string;

    public abstract setRefreshToken(token: string): void;

    protected initVue() {
        const token = this.getRefreshToken();
        if (token) {
            this.options.Vue.$data.refresh_token = token;
        }
    }
}
