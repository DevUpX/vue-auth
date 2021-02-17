import { AxiosResponse } from "axios";

export type TokenType = "Bearer" | "Basic";
export type Method = "GET" | "POST";

export interface IBasicRedirectData {
    url: string;
    method: Method;
}

export interface IOptionalRedirectData {
    url?: string;
    method?: Method;
}

export interface IBasicRedirectEnabledData extends IOptionalRedirectData {
    enabled?: boolean;
}

export interface IRedirectData {
    redirect?: string;
}

export interface ILoginRedirectData extends IRedirectData, IBasicRedirectData {
    fetchUser?: boolean;
    fetchData?: (response: AxiosResponse) => any;
}

export interface IRegisterRedirectData extends IRedirectData, IBasicRedirectData {
    fetchUser?: boolean;
    fetchData?: (response: AxiosResponse) => any;
}

export interface ILogoutRedirectData extends IRedirectData, IOptionalRedirectData {
    makeRequest?: boolean;
}

export interface IFetchData extends IBasicRedirectEnabledData {
    interval?: number;
}

export interface IRefreshData extends IFetchData {
    interval?: number;
}

export interface IAuthUser {
    [key: string]: any;
}

export interface ITokenName {
    accessName: string;
    refreshName: string;
}

export interface IVueAuthOptions {
    authMeta?: string;
    tokenDefaultName?: string;
    userDefaultName?: string;
    headerTokenReplace?: string;
    tokenType?: TokenType;
    vuexStoreSpace?: string;
    fetchItem?: string;
    tokenName: ITokenName;

    authRedirect?: string;

    loginData?: ILoginRedirectData;
    registerData?: IRegisterRedirectData;
    logoutData?: ILogoutRedirectData;
    fetchData?: IFetchData;
    refreshData?: IRefreshData;
}
