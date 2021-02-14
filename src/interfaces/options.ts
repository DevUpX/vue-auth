import { AxiosResponse } from 'axios';

export type TokenType = 'Bearer' | 'Basic';
export type Method = 'GET' | 'POST';

export interface BasicRedirectData {
    url: string;
    method: Method;
}

export interface OptionalRedirectData {
    url?: string;
    method?: Method;
}

export interface BasicRedirectEnabledData extends OptionalRedirectData {
    enabled?: boolean;
}

export interface RedirectData {
    redirect?: string;
}

export interface LoginRedirectData extends RedirectData, BasicRedirectData {
    fetchUser?: boolean;
    fetchData?: (response: AxiosResponse) => any;
}

export interface RegisterRedirectData extends RedirectData, BasicRedirectData {
    fetchUser?: boolean;
    fetchData?: (response: AxiosResponse) => any;
}

export interface LogoutRedirectData extends RedirectData, OptionalRedirectData {
    makeRequest?: boolean;
}

export interface FetchData extends BasicRedirectEnabledData {
    interval?: number;
}

export interface RefreshData extends FetchData {
    interval?: number;
}

export interface AuthUser {
    [key: string]: any;
}

export interface TokenName {
    accessName: string;
    refreshName: string;
}

export interface VueAuthOptions {
    authMeta?: string;
    tokenDefaultName?: string;
    userDefaultName?: string;
    headerTokenReplace?: string;
    tokenType?: TokenType;
    vuexStoreSpace?: string;
    fetchItem?: string;
    tokenName: TokenName;

    authRedirect?: string;

    loginData?: LoginRedirectData;
    registerData?: RegisterRedirectData;
    logoutData?: LogoutRedirectData;
    fetchData?: FetchData;
    refreshData?: RefreshData;
}
