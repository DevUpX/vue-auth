import { IAuthUser } from "./Options";
import { IAuthOptions } from "../lib/auth";

interface IVueAuthSessionStorage {
    getUser(): IAuthUser;
    setUser(user: IAuthUser): void;
    getAccessToken(): string;
    setAccessToken(token: string): void;
}

export abstract class VueAuthSessionStorage implements IVueAuthSessionStorage {
    protected store: any;

    protected constructor(protected Vue: any, protected options: IAuthOptions) {
    }

    public abstract getUser(): IAuthUser;

    public abstract setUser(user: IAuthUser): void;

    public abstract getAccessToken(): string;

    public abstract setAccessToken(token: string): void;

    protected initVue() {
        const token = this.getAccessToken();
        if (token) {
            this.options.Vue.$data.access_token = token;
        }
        const user = this.getUser();
        if (user) {
            this.options.Vue.$data.user = user;
        }
    }
}
