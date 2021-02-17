import { IAuthUser } from "./options";
import { IAuthOptions } from "../lib/auth";

interface IVueAuthStore {
    getUser(): IAuthUser;
    setUser(user: IAuthUser): void;
    getAccessToken(): string;
    setAccessToken(token: string): void;
    getRefreshToken(): string;
    setRefreshToken(token: string): void;
}

export abstract class VueAuthStore implements IVueAuthStore {
    protected store: any;
    protected constructor(protected Vue: any, protected options: IAuthOptions) {
    }

    public abstract getUser(): IAuthUser;

    public abstract setUser(user: IAuthUser): void;

    public abstract getAccessToken(): string;

    public abstract setAccessToken(token: string): void;

    public abstract getRefreshToken(): string;

    public abstract setRefreshToken(token: string): void;
}
