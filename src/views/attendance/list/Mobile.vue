<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-5 py-5">
    <v-row>
      <v-col cols="12" :class="{ 'd-none': hello }">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >출석 테이블
            <v-card-subtitle class="d-inline px-0"
              >| {{ attendanceDate }}</v-card-subtitle
            ></v-card-title
          >
          <v-text-field
            v-model="searchValue"
            density="comfortable"
            label="Search"
            variant="solo"
            class="ms-4 mt-3 w-50"
            clearable
          ></v-text-field>
          <v-tabs v-model="tab" class="ms-4" bg-color="white">
            <v-tab value="ALL" @click="filterPosition('ALL')">전체</v-tab>
            <v-tab value="STAFF" @click="filterPosition('STAFF')">STAFF</v-tab>
            <v-tab value="QB" @click="filterPosition('QB')">QB</v-tab>
            <v-tab value="OL" @click="filterPosition('OL')">OL</v-tab>
            <v-tab value="WR" @click="filterPosition('WR')">WR</v-tab>
            <v-tab value="RB" @click="filterPosition('RB')">RB</v-tab>
            <v-tab value="DL" @click="filterPosition('DL')">DL</v-tab>
            <v-tab value="LB" @click="filterPosition('LB')">LB</v-tab>
            <v-tab value="HYB" @click="filterPosition('HYB')">HYB</v-tab>
            <v-tab value="CB" @click="filterPosition('CB')">CB</v-tab>
          </v-tabs>
          <v-card-text class="font-weight-medium mt-lg-3">
            <EasyDataTable
              ref="attendanceListTable"
              :headers="attendanceHeaders"
              :items="filteredAttendanceItems"
              :rows-per-page="10"
              :search-value="searchValue"
              table-class-name="attendance-search-table"
              theme-color="#1d90ff"
              show-index
              alternating
            >
              <template #expand="item">
                <div style="padding: 15px">{{ item.reason }}</div>
              </template>
              <template #item-location="item">
                {{
                  item.location === "Integrated"
                    ? "통합"
                    : item.location === "Suwon"
                    ? "율전"
                    : "명륜"
                }}
              </template>
              <template #item-response="item">
                <v-chip
                  class="font-weight-bold"
                  :class="
                    item.survey === 'Present'
                      ? 'bg-green-darken-3'
                      : item.survey === 'Tardy'
                      ? 'bg-amber-darken-2 text-white'
                      : 'bg-red-darken-4'
                  "
                  size="small"
                >
                  {{
                    item.survey === "Present"
                      ? "참석"
                      : item.survey === "Tardy"
                      ? "늦참"
                      : "불참"
                  }}
                </v-chip>
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >출석 날짜 선택 테이블
            <v-card-subtitle class="d-inline px-0"
              >| {{ season }} season</v-card-subtitle
            ></v-card-title
          >
          <v-card-text class="font-weight-medium mt-lg-3">
            <EasyDataTable
              :headers="headers"
              :items="items"
              :rows-per-page="10"
              table-class-name="attendance-search-table"
              theme-color="#1d90ff"
              show-index
              alternating
              :loading="tableLoading"
            >
              <template #item-date="item">
                {{ item.date.slice(0, 10) }}
              </template>
              <template #item-select="item">
                <v-btn
                  class="bg-blue-darken-2"
                  @click="getAttendances(item)"
                  icon="fas fa-magnifying-glass"
                  rounded="lg"
                  size="x-small"
                ></v-btn>
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";
import { axiosInstance } from "@/common/store/auth";
import { Header } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";

const tab = ref();

const attendanceListTable = ref();
const searchValue = ref();

axiosInstance
  .get("/api/attendance/date-list")
  .then((result) => {
    items.value = result.data;
  })
  .catch((error) => {
    console.log(error);
    return false;
  })
  .finally(() => (tableLoading.value = false));

const tableLoading = ref(true);

const hello = ref(true);

const icon = ref("fas fa-clipboard-check");
const title = ref("출석명단");
const breadcumbs = ref([
  {
    title: "출석관리",
    disabled: false,
  },
  {
    title: "출석명단 조회",
    disabled: false,
  },
]);

const season = ref(new Date().getFullYear());

const items: Ref<AttendanceDatesDTO[]> = ref([]);

type AttendanceDatesDTO = {
  date: string;
  isGame: boolean;
};

const headers: Header[] = [
  { text: "운동날짜", value: "date", sortable: true },
  { text: "시합여부", value: "isGame", sortable: true },
  { text: "선택", value: "select" },
];

type AttendanceDTO = {
  id: number;
  date: string;
  name: string;
  actual: string;
  studentNo: number;
  location: string;
  survey: boolean;
  reason: string;
  offPosition: string;
  defPosition: string;
};

async function getAttendances(item: AttendanceDatesDTO) {
  const attendances: AttendanceDTO[] = await axiosInstance
    .get(`/api/attendance/${item.date}`)
    .then((result) => result.data)
    .catch((error) => {
      console.log(error);
      return false;
    });

  if (attendances) {
    attendanceListTable.value.updatePage(1);
    attendanceDate.value = item.date.slice(0, 10);
    attendanceItems.value = attendances;
    filteredAttendanceItems.value = [...attendances];
    hello.value = false;
  }
}

function filterPosition(position: string) {
  attendanceListTable.value.updatePage(1);
  if (position === "ALL") {
    filteredAttendanceItems.value = attendanceItems.value;
  } else {
    filteredAttendanceItems.value = attendanceItems.value.filter(
      (attendance) =>
        attendance.offPosition === position ||
        attendance.defPosition === position
    );
  }
}

const attendanceDate = ref("");
const filteredAttendanceItems: Ref<AttendanceDTO[]> = ref([]);
const attendanceItems: Ref<AttendanceDTO[]> = ref([]);
const attendanceHeaders: Header[] = [
  { text: "이름", value: "name" },
  { text: "학번", value: "studentNo" },
  { text: "위치", value: "location" },
  { text: "응답", value: "response" },
];
</script>

<style>
.attendance-search-table {
  --easy-table-header-font-size: 12px;
  --easy-table-header-height: 50px;
  --easy-table-header-item-padding: 10px 10px;

  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 11px;
  --easy-table-body-row-font-weight: 700;

  --easy-table-body-row-hover-font-color: #e8eaf6;
  --easy-table-body-row-hover-background-color: #3949ab;

  --easy-table-body-item-padding: 10px 10px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;
}
</style>
