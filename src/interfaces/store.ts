import { AuthUser } from './options';
import { IVueAuthOptions } from '../lib/auth';

interface IVueAuthStore {
    getUser(): AuthUser;
    setUser(user: AuthUser): void;
    getAccessToken(): string;
    setAccessToken(token: string): void;
    getRefreshToken(): string;
    setRefreshToken(token: string): void;
}

export abstract class VueAuthStore implements IVueAuthStore {
    protected store: any;
    protected constructor(protected Vue: any, protected options: IVueAuthOptions) {
    }

    public abstract getUser(): AuthUser;

    public abstract setUser(user: AuthUser): void;

    public abstract getAccessToken(): string;

    public abstract setAccessToken(token: string): void;

    public abstract getRefreshToken(): string;

    public abstract setRefreshToken(token: string): void;
}
