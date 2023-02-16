/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import router from "@/router";

// Plugins
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";

import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const app = createApp(App);

registerPlugins(app);
app.component("EasyDataTable", Vue3EasyDataTable);
app.use(router);
app.use(createPinia());
app.mount("#app");
