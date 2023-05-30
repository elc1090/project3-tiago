import "@/assets/vendor/nucleo/css/nucleo.css";
import "@/assets/scss/argon.scss";
import globalComponents from "./globalComponents";
import globalDirectives from "./globalDirectives";
import SidebarPlugin from "@/components/SidebarPlugin/index";
import NotificationPlugin from "@/components/NotificationPlugin/index";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Toasted from "vue-toasted";
import VueMask from "v-mask";
import VueTheMask from "vue-the-mask";
import VTooltip from "v-tooltip";
import VueYoutube from "vue-youtube";
import VueTour from "vue-tour";
import "vue-tour/dist/vue-tour.css";

import * as VueGoogleMaps from "vue2-google-maps";

export default {
  install(Vue) {
    Vue.use(globalComponents);
    Vue.use(globalDirectives);
    Vue.use(SidebarPlugin);
    Vue.use(NotificationPlugin);
    Vue.use(Loading, {
      loader: "bars",
      color: "#fb6340",
    });
    Vue.use(Toasted, {
      position: "bottom-center",
      iconPack: "fontawesome",
      type: "success",
      theme: "bubble",
      duration: 3000,
      action: {
        text: "x",
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        },
      },
    });
    Vue.use(VueMask);
    Vue.use(VueTheMask);
    Vue.use(VTooltip);
    Vue.use(VueYoutube);
    Vue.use(VueGoogleMaps, {
      load: {
        key: "AIzaSyBah7Sg6aUqKIY4uA9x2_DfCTCCpTmaojs",
        libraries: "places",
        language: "pt-BR",
        region: "BR",
      },
    });
    Vue.use(VueTour);
  },
};
