<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";

const icon = ref("fas fa-clipboard-check");
const title = ref("출석체크");
const breadcumbs = ref([
  {
    title: "출석관리",
    disabled: false,
  },
  {
    title: "출석체크",
    disabled: false,
  },
]);
</script>
