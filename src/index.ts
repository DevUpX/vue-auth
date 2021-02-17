import { PluginObject, VueConstructor } from "vue";
import { IVueAuthOptions } from "./interfaces";
import Auth from "./lib/auth";

declare global {
  interface Window {
    Vue: VueConstructor;
  }
}

const version = "__VERSION__";

const install = (Vue: any, options: IVueAuthOptions = {} as IVueAuthOptions): void => {
  if (plugin.installed) {
    return;
  }
  plugin.installed = true;
  const auth = new Auth(Vue, options);
  Vue.$auth = auth;
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return auth;
      },
    },
  });
};

const plugin: PluginObject<IVueAuthOptions> = {
  install,
  version,
};
export default plugin;
export * from "./interfaces";
export { DEFAULT_OPTIONS } from "./lib/auth";

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(plugin, {});
}
