import { AuthUser } from './Options';
import { IVueAuthOptions } from '../lib/auth';

interface IVueAuthSessionStorage {
    getUser(): AuthUser;
    setUser(user: AuthUser): void;
    getAccessToken(): string;
    setAccessToken(token: string): void;
}

export abstract class VueAuthSessionStorage implements IVueAuthSessionStorage {
    protected store: any;

    protected constructor(protected Vue: any, protected options: IVueAuthOptions) {
    }

    public abstract getUser(): AuthUser;

    public abstract setUser(user: AuthUser): void;

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
