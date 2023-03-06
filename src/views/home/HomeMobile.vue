<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-5 pb-10">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-h6 text-indigo-darken-4"
            >Profile
            <v-card-subtitle class="d-inline px-0"
              >| 내 프로필</v-card-subtitle
            ></v-card-title
          >
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-avatar size="100px">
                  <v-img :src="profileUrl"></v-img>
                </v-avatar>
              </v-row>
              <v-row class="font-weight-bold text-h6 mt-7" justify="center">
                {{ userNickname }}
              </v-row>
              <v-row
                class="align-self-center text-subtitle-1 mt-2 text-grey-darken-1"
                justify="center"
              >
                {{ role }}
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            class="pa-2 transition-swing"
            v-bind="props"
            to="/attendance/check"
            :elevation="isHovering ? 16 : 3"
            :class="{ 'on-hover': isHovering }"
          >
            <v-card-title class="text-indigo-darken-4">
              <v-card-subtitle class="d-inline px-0"></v-card-subtitle
            ></v-card-title>
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-avatar size="70px" class="bg-green-lighten-4">
                    <v-icon
                      icon="fas fa-check"
                      size="40px"
                      class="text-green"
                    ></v-icon>
                  </v-avatar>
                </v-row>
                <v-row
                  class="font-weight-bold text-h6 mt-7"
                  justify="center"
                  :class="{ 'text-green-accent-4': isHovering }"
                >
                  출석체크
                </v-row>
                <v-row
                  class="align-self-center text-subtitle-2 mt-4 text-grey-darken-1"
                  justify="center"
                >
                  출석체크 페이지로 이동합니다
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            class="pa-2 transition-swing"
            v-bind="props"
            to="/attendance/list"
            :elevation="isHovering ? 16 : 3"
            :class="{ 'on-hover': isHovering }"
          >
            <v-card-title class="text-indigo-darken-4">
              <v-card-subtitle class="d-inline px-0"></v-card-subtitle
            ></v-card-title>
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-avatar size="70px" class="bg-amber-lighten-4">
                    <v-icon
                      icon="fas fa-check"
                      size="40px"
                      class="text-amber"
                    ></v-icon>
                  </v-avatar>
                </v-row>
                <v-row
                  class="font-weight-bold text-h6 mt-7"
                  justify="center"
                  :class="{ 'text-amber-accent-3': isHovering }"
                >
                  출석명단
                </v-row>
                <v-row
                  class="align-self-center text-subtitle-2 mt-4 text-grey-darken-1"
                  justify="center"
                >
                  출석명단 페이지로 이동합니다
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4 text-h6"
            >나의 출석
            <v-card-subtitle class="d-inline px-0 text-subtitle-2"
              >| 최근 5회</v-card-subtitle
            ></v-card-title
          >
          <v-card-text class="font-weight-medium mt-lg-3">
            <EasyDataTable
              :headers="headers"
              :items="items"
              table-class-name="attendance-table-mo"
              theme-color="#1d90ff"
              show-index
              alternating
            >
              <template #item-attendance="item">
                <v-chip
                  size="small"
                  class="font-weight-bold text-white"
                  :class="calculateColor(item.attendance)"
                  >{{ item.attendance }}</v-chip
                >
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";
import { axiosInstance } from "@/common/store/auth";
import type { Header } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";

function calculateColor(attendance: string) {
  return attendance === "불참"
    ? "bg-red-darken-3"
    : attendance === "늦참"
    ? "bg-amber-darken-2"
    : "bg-green-darken-3";
}

const headers: Header[] = [
  { text: "운동날짜", value: "date", sortable: true },
  { text: "위치", value: "location", sortable: true },
  { text: "출결", value: "attendance", sortable: true },
];

const items = ref([]);

watchEffect(async () => {
  const attendances = await axiosInstance
    .get("/api/attendance/recent")
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

  if (attendances) {
    items.value = attendances.attendances;
  }
});

const role = ref();
const userNickname = ref();
const profileUrl = ref();

watchEffect(async () => {
  const profile = await axiosInstance
    .get("/api/band/profile")
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

  if (profile) {
    role.value = profile.role;
    userNickname.value = profile.userNickname;
    profileUrl.value = profile.profileUrl;
  }
});

const icon = ref("fas fa-house-chimney");
const title = ref("Home");
const breadcumbs = ref([
  {
    title: "Home",
    disabled: false,
  },
]);
</script>

<style>
.attendance-table-mo {
  --easy-table-header-font-size: 12px;
  --easy-table-header-height: 30px;
  --easy-table-header-item-padding: 10px 10px;

  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 11px;

  --easy-table-body-row-hover-font-color: #e8eaf6;
  --easy-table-body-row-hover-background-color: #3949ab;

  --easy-table-body-item-padding: 10px 10px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;
}
.attendance-table-mo .v-chip {
  font-size: 0.5rem;
}
</style>
