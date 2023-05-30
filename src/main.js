import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import ArgonDashboard from "./plugins/argon-dashboard";
import moment from "moment";
// import VueGtag from "vue-gtag";

Vue.config.productionTip = false;

Vue.use(ArgonDashboard);

moment.locale("pt-BR");
Vue.prototype.moment = moment;

Vue.mixin({
  methods: {
    formatDate(rawDate, format = "ll") {
      return this.moment(rawDate, "YYYY-MM-DD").locale("pt-br").format(format);
    },
    formatTimestamp(timestamp, format = "LLL") {
      return this.moment(timestamp, "YYYY-MM-DD hh:mm:ss")
        .locale("pt-br")
        .format(format);
    },
    getYear(input) {
      const date = this.moment(input);
      return date.isValid() ? date.year() : "...";
    },
    formatValue(value, allowNegative = false) {
      const valueNumber = Number(value);
      if (valueNumber > 0 || allowNegative) {
        return valueNumber.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }
      return "-";
    },
    getAddressStr(obj) {
      let addressStr = "";
      if (obj.street) {
        addressStr += obj.street + ", ";
        if (obj.street_number) addressStr += obj.street_number + " - ";
      }
      addressStr += obj.neighborhood ? obj.neighborhood + ", " : "";
      addressStr += obj.city ? obj.city + ", " : "";
      addressStr += obj.cep ? obj.cep + ", " : "";
      addressStr += obj.state ? obj.state + " - " : "";
      addressStr += "Brasil";
      return addressStr;
    },
    fetchLatLng(address) {
      return new Promise((resolve, reject) => {
        this.$gmapApiPromiseLazy()
          .then((google) => {
            const geocoder = new google.maps.Geocoder();
            return geocoder.geocode(
              { address: address, region: "BR" },
              (result, status) => {
                if (status === "OK" && result.length) {
                  const lat = result[0].geometry.location.lat();
                  const lng = result[0].geometry.location.lng();
                  return resolve({ lat, lng });
                }
                return reject(status);
              }
            );
          })
          .catch((e) => reject(e));
      });
    },
    fetchAddress(lat, lng) {
      const latLng = { lat: lat, lng: lng };
      return new Promise((resolve, reject) => {
        this.$gmapApiPromiseLazy()
          .then((google) => {
            const geocoder = new google.maps.Geocoder();
            return geocoder.geocode(
              { location: latLng, region: "BR" },
              (result, status) => {
                if (status === "OK" && result.length) {
                  const components = {};
                  result[0].address_components.forEach((component) => {
                    component.types.forEach((type) => {
                      components[type] = component.long_name;
                    });
                  });
                  return resolve(components);
                }
                return reject(status);
              }
            );
          })
          .catch((e) => reject(e));
      });
    },
  },
});

// Configuration VueGtag
// Vue.use(
//   VueGtag,
//   {
//     config: { id: "UA-146743116-2" },
//     appName: "Portal Incubadoras",
//     pageTrackerScreenviewEnabled: true
//   },
//   router
// );

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
