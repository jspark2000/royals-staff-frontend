/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable of handling css files
import { aliases, fa } from "vuetify/iconsets/fa";

// Composables
import { createVuetify } from "vuetify";
import * as labs from "vuetify/labs/components";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
  components: {
    ...labs,
  },
});
