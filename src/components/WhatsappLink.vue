<template>
  <div>
    <i
      v-if="showLeftPhoneIcon || overhidePhoneIcon"
      class="fas fa-phone mr-2"
    />
    <span
      title="Abrir no WhatsApp"
      class="cursor-pointer"
      @click="openWindow(url)"
    >
      {{ phoneNumber | VMask(getMask(phoneNumber)) }}
      <i v-if="showWhatsAppIcon" class="fab fa-whatsapp text-success ml-1" />
    </span>
  </div>
</template>
<script>
import { isMobile } from "mobile-device-detect";

export default {
  name: "WhatsappLink",
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
    showLeftPhoneIcon: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      overhidePhoneIcon: false,
      showWhatsAppIcon: true,
    };
  },
  computed: {
    url() {
      let mobileUrl = `https://wa.me/55${this.phoneNumber}`;
      let desktopUrl = `https://web.whatsapp.com/send?phone=55${this.phoneNumber}`;
      if (this.text) {
        mobileUrl += `?text=${this.text}`;
        desktopUrl += `&text=${this.text}`;
      }
      return isMobile ? mobileUrl : desktopUrl;
    },
  },
  methods: {
    openWindow(url) {
      if (isMobile) {
        window.open(url, "_blank").focus();
      } else {
        // open popup
        const newWindow = window.open(
          url,
          "wpp-window",
          "resizable=1,height=750,width=750"
        );
        if (window.focus) {
          newWindow.focus();
        }
      }
    },
    getMask(number) {
      if (number && number.match(/\d/g).join("").length >= 11)
        return "(##) #####-####";
      this.overhidePhoneIcon = true;
      this.showWhatsAppIcon = false;
      return "(##) ####-####";
    },
  },
};
</script>
<style scoped>
i.fa-external-link-alt {
  font-size: 0.9rem !important;
}
</style>
