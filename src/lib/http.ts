import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {IVueAuthLogin, IVueAuthRegister} from "../interfaces";
import AuthStoreManager from "./store-manager";
import AuthVueRouter from "./router";
import {IAuthOptions} from "./auth";

export default class AuthVueHttp {
    private readonly http: AxiosInstance;
    private intervalFetchData: any;
    private intervalRefreshData: any;
    private readonly MINUTE_IN_MS = 60 * 1000;

    constructor(
        private readonly Vue: any,
        private readonly options: IAuthOptions,
        private readonly storeManager: AuthStoreManager,
        private readonly router: AuthVueRouter) {
        if (!this.Vue.axios) {
            throw Error("[vue-auth] vue-axios is a required dependency");
        }
        this.http = Vue.axios as AxiosInstance;
        this.configureHttp();
        this.loginWithToken();
    }

    public login(loginInfo: IVueAuthLogin) {
        if (!this.options.loginData) {
            return Promise.reject(false);
        }
        const nextUrls = this.router.router.currentRoute.query.nextUrl;
        const nextUrl = Array.isArray(nextUrls) ? nextUrls[0] : nextUrls;
        const { method, url, redirect, fetchUser } = this.options.loginData;
        const promise = this.http({
            data: loginInfo,
            method,
            url,
        });
        promise.then(async (response: AxiosResponse) => {
            this.extractToken(response);
            this.startIntervals();
            if (fetchUser) {
                await this.fetchData();
            }
            await this.router.afterLogin(redirect || nextUrl);
            return response;
        });
        return promise;
    }

    public loginWithToken() {
        if (!this.options.refreshData || !this.options.loginData) {
            return Promise.reject(false);
        }
        if (!this.storeManager.getRefreshToken()) {
            return;
        }
        const { method, url } = this.options.refreshData;
        const { redirect, fetchUser } = this.options.loginData;
        const promise = this.http({
            headers: { ...{Authorization: this.storeManager.getRefreshToken()} },
            method,
            url,
        });
        promise.then(async (response: AxiosResponse) => {
            this.extractToken(response);
            this.startIntervals();
            if (fetchUser) {
                await this.fetchData();
            }
            const nextUrls = this.router.router.currentRoute.query.nextUrl;
            const nextUrl = Array.isArray(nextUrls) ? nextUrls[0] : nextUrls;
            if (nextUrl) {
                await this.router.afterLogin(redirect || nextUrl);
            }
            return response;
        });
        return promise;
    }

    public register(registerInfo: IVueAuthRegister) {
        if (!this.options.registerData) {
            return Promise.reject(false);
        }
        const nextUrls = this.router.router.currentRoute.query.nextUrl;
        const nextUrl = Array.isArray(nextUrls) ? nextUrls[0] : nextUrls;
        const { method, url, redirect, fetchUser } = this.options.registerData;
        const promise = this.http({
            data: registerInfo,
            method,
            url,
        });
        promise.then(async (response: AxiosResponse) => {
            this.extractToken(response);
            this.startIntervals();
            if (fetchUser) {
                await this.fetchData();
            }
            await this.router.afterLogin(redirect || nextUrl);
            return response;
        });
        return promise;
    }

    public logout(forceRedirect = false) {
        const logout = this.options.logoutData && typeof this.options.logoutData === "object" &&
        Object.keys(this.options.logoutData).length ? this.options.logoutData : {};
        const { url, method, redirect, makeRequest } = logout;
        if (makeRequest) {
            this.http({
                headers: { ...this.getAuthHeader() },
                method,
                url,
            })
                .finally(() => {
                    this.storeManager.resetAll();
                    if (redirect || forceRedirect) {
                        this.router.push(redirect || "/");
                    }
                });
        }
        if (this.intervalFetchData) {
            clearInterval(this.intervalFetchData);
        }
        this.storeManager.resetAll();
        if (redirect || forceRedirect) {
            this.router.push(redirect || "/");
        }
    }

    public fetchData() {
        const fetch = this.options.fetchData && typeof this.options.fetchData === "object" &&
        Object.keys(this.options.fetchData).length ? this.options.fetchData : {};
        const { method, url } = fetch;
        if (url && method && this.storeManager.getAccessToken()) {
            const promise = this.http({
                headers: { ...this.getAuthHeader() },
                method,
                url,
            });
            promise
                .then(({ data }: AxiosResponse) => {
                    const { fetchItem } = this.options;
                    this.storeManager.setUser(fetchItem ? data[fetchItem] : data);
                    return data;
                });
            return promise;
        }
        return Promise.resolve(null);
    }

    public refresh(force = false) {
        const refresh = this.options.refreshData && typeof this.options.refreshData === "object" &&
        Object.keys(this.options.refreshData).length ? this.options.refreshData : {};
        const { enabled, method, url } = refresh;
        if ((enabled || force) && url && method && this.storeManager.getRefreshToken()) {
            const promise = this.http({
                headers: { ...this.getAuthHeader() },
                method,
                url,
            });
            promise
                .then(async (response: AxiosResponse) => {
                    this.extractToken(response);
                    return response;
                });
            return promise;
        }
        return Promise.resolve(null);
    }

    private configureHttp() {
        const token = this.storeManager.getRefreshToken();

        if (!!token) {
            this.startIntervals();
        }
        this.http.interceptors.request.use((request: AxiosRequestConfig) => {
            if (request.headers) {
                Object.keys(request.headers)
                    .forEach((head) => {
                        const value: string = request.headers[head];
                        if (value
                            && typeof value === "string"
                            && this.options.headerTokenReplace
                            && value.includes(this.options.headerTokenReplace)) {
                            request.headers[head] = value.replace(
                                this.options.headerTokenReplace,
                                this.storeManager.getAccessToken(),
                            );
                        }
                    });
            }
            return request;
        }, (error: any) => {
            return Promise.reject(error);
        });
        this.http.interceptors.response.use((response: AxiosResponse) => {
            return response;
        }, (error: any) => {
            const status = error && error.response && error.response.status;
            if (status === 401) {
                this.logout();
            }
            return Promise.reject(error);
        });
    }

    private startIntervals() {
        this.startRefreshDataInterval();
        this.startFetchDataInterval();
    }

    private startFetchDataInterval(): void {
        if (!this.options.fetchData) {
            return;
        }
        const { interval } = this.options.fetchData;
        if (interval && !this.intervalFetchData) {
            this.intervalFetchData = setInterval(() => {
                void this.fetchData();
            }, interval * this.MINUTE_IN_MS);
        }
    }

    private startRefreshDataInterval(): void {
        if (!this.options.refreshData) {
            return;
        }
        const { interval } = this.options.refreshData;
        if (interval && !this.intervalRefreshData) {
            this.intervalRefreshData = setInterval(() => {
                void this.refresh();
            }, interval * this.MINUTE_IN_MS);
        }
    }

    private extractToken(response: AxiosResponse) {
        if (!this.options.loginData) {
            return;
        }
        const { accessName, refreshName } = this.options.tokenName;
        const accessToken = response.data[accessName];
        const refreshToken = response.data[refreshName];
        if (!accessToken && !refreshToken) {
            return;
        } else {
            if (accessToken) {
                this.storeManager.setAccessToken(accessToken);
            }
            if (refreshToken) {
                this.storeManager.setRefreshToken(refreshToken);
            }
        }
    }

    private getAuthHeader() {
        if (this.options.loginData) {
            const { tokenType, headerTokenReplace } = this.options;
            const token = `${tokenType} ${headerTokenReplace}`;
            return { Authorization: token };
        }
        return {};
    }
}
