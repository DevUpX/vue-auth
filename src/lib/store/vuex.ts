import { ActionContext, MutationPayload, Store } from "vuex";
import { IAuthUser, VueAuthStore } from "../../interfaces";
import { IAuthOptions } from "../auth";

export interface IAuthVuexState {
    access_token?: string;
    refresh_token?: string;
    user?: IAuthUser;
};

export default class StoreVuex extends VueAuthStore {
    private readonly module?: string;
    private readonly ACTION_SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
    private readonly ACTION_SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN";
    private readonly ACTION_SET_USER = "SET_USER";

    constructor(Vue: any, options: IAuthOptions) {
        super(Vue, options);
        if (!this.Vue.store) {
            throw Error("[vue-auth-plugin] vuex is a required dependency if you want to use 'vuex' as storage");
        }
        this.store = this.Vue.store as Store<any>;
        this.module = this.options.vuexStoreSpace;
        this.createVueAuthStore();
    }

    public getAccessToken(): string {
        return this.store.getters?.[`${this.module}/getAccessToken`];
    }

    public getRefreshToken(): string {
        return this.store.getters?.[`${this.module}/getRefreshToken`];
    }

    public getUser(): IAuthUser {
        return this.store.getters?.[`${this.module}/getUser`];
    }

    public setAccessToken(token: string | null): void {
        this.store.dispatch(`${this.module}/setAccessToken`, token);
    }

    public setRefreshToken(token: string | null): void {
        this.store.dispatch(`${this.module}/setRefreshToken`, token);
    }

    public setUser(user: IAuthUser | null): void {
        this.store.dispatch(`${this.module}/setUser`, user);
    }

    private createVueAuthStore() {
        const module = {
            actions: {
                setAccessToken: (actionContext: ActionContext<IAuthVuexState, any>, token: string) => {
                    actionContext.commit(this.ACTION_SET_ACCESS_TOKEN, token);
                },
                setRefreshToken: (actionContext: ActionContext<IAuthVuexState, any>, token: string) => {
                    actionContext.commit(this.ACTION_SET_REFRESH_TOKEN, token);
                },
                setUser: (actionContext: ActionContext<IAuthVuexState, any>, user: IAuthUser) => {
                    actionContext.commit(this.ACTION_SET_USER, user);
                },
            },
            getters: {
                getAccessToken: (state: IAuthVuexState): string | undefined => {
                    return state.access_token;
                },
                getRefreshToken: (state: IAuthVuexState): string | undefined => {
                    return state.refresh_token;
                },
                getUser: (state: IAuthVuexState): IAuthUser | undefined => {
                    return state.user;
                },
            },
            mutations: {
                SET_ACCESS_TOKEN: (state: IAuthVuexState, token: string) => {
                    state.access_token = token;
                },
                SET_REFRESH_TOKEN: (state: IAuthVuexState, token: string) => {
                    state.refresh_token = token;
                },
                SET_USER: (state: IAuthVuexState, user: IAuthUser) => {
                    state.user = user;
                },
            },
            namespaced: true,
            state: {
                access_token: this.options.Vue.$data.access_token,
                refresh_token: this.options.Vue.$data.refresh_token,
                user: this.options.Vue.$data.user,
            } as IAuthVuexState,
        };

        if (this.module) {
            this.store.registerModule(this.module, module);
        }
        // Listen for mutation from outside, e.g. with vuex-shared-mutations
        this.store.subscribe((mutation: MutationPayload) => {
            const { payload, type } = mutation;
            if (type === `${this.module}/${this.ACTION_SET_ACCESS_TOKEN}`
                && payload !== this.options.Vue.$data.access_token) {
                this.options.Vue.$data.access_token = payload;
            } else if (type === `${this.module}/${this.ACTION_SET_REFRESH_TOKEN}`
                && payload !== this.options.Vue.$data.refresh_token) {
                this.options.Vue.$data.refresh_token = payload;
            } else if (type === `${this.module}/${this.ACTION_SET_USER}` && payload !== this.options.Vue.$data.user) {
                this.options.Vue.$data.user = payload;
            }
        });
    }
}
