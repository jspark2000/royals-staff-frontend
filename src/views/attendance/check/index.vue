<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-10 py-5">
    <v-row>
      <v-col cols="12" :class="{ 'd-none': attendanceCheckTable }">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >출석 테이블
            <v-card-subtitle class="d-inline px-0"
              >| {{ attendanceDate }}</v-card-subtitle
            ></v-card-title
          >
          <v-card-text class="font-weight-medium mt-lg-3">
            <EasyDataTable
              :headers="attendanceHeaders"
              :items="filteredAttendanceItems"
              :rows-per-page="10"
              table-class-name="attendance-date-table"
              theme-color="#1d90ff"
              show-index
              alternating
            >
              <template #item-location="item">
                {{
                  item.location === "integrated"
                    ? "통합"
                    : item.location === "suwon"
                    ? "율전"
                    : "명륜"
                }}
              </template>
              <template #item-response="item">
                <v-chip
                  class="font-weight-bold"
                  :class="
                    item.survey
                      ? item.late
                        ? 'bg-amber-darken-2 text-white'
                        : 'bg-green-darken-3'
                      : 'bg-red-darken-4'
                  "
                  size="small"
                >
                  {{ item.survey ? (item.late ? "늦참" : "참석") : "불참" }}
                </v-chip>
              </template>
              <template #item-check="item">
                <v-btn
                  :class="{ 'd-none': item.checked }"
                  class="bg-amber-darken-1 text-white"
                  @click="getCheckModal(item)"
                  icon="fas fa-pencil"
                  rounded="lg"
                  size="x-small"
                ></v-btn>
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
              table-class-name="attendance-date-table"
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
                  class="bg-red-darken-2"
                  @click="getAttendances(item)"
                  icon="fas fa-pencil"
                  rounded="lg"
                  size="x-small"
                ></v-btn>
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="checkModal" width="auto">
      <v-sheet width="300" class="mx-auto pa-10">
        <h5 class="text-h6 font-weight-bold mb-5">출석체크</h5>
        <v-form @submit.prevent @submit="checkAttendance()">
          <v-text-field
            v-model="targetId"
            variant="outlined"
            label="id"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="targetName"
            variant="outlined"
            label="이름"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="targetStudentNo"
            variant="outlined"
            type="number"
            label="입학년도"
            readonly
          ></v-text-field>
          <v-select
            v-model="targetLocation"
            variant="outlined"
            label="위치"
            :items="['통합', '명륜', '율전']"
          ></v-select>
          <v-select
            v-model="actualAttendance"
            variant="outlined"
            label="실제출석"
            :items="['참석', '늦참', '불참']"
          ></v-select>
          <v-btn type="submit" block class="bg-amber-lighten-2">체크하기</v-btn>
          <v-btn
            @click="() => (checkModal = false)"
            block
            class="mt-3 bg-green-lighten-2"
            >뒤로가기</v-btn
          >
        </v-form>
      </v-sheet>
    </v-dialog>
    <v-dialog
      v-model="resultModal"
      z-index="100005"
      location-strategy="static"
      persistent
    >
      <v-alert
        :type="checkResult"
        :title="checkTitle"
        :text="checkText"
        width="60%"
        border
        class="align-self-center"
      >
        <v-row class="mt-2">
          <v-col>
            <v-btn @click="resultModal = false" class="bg-green-darken-4"
              >확인</v-btn
            >
          </v-col>
        </v-row>
      </v-alert>
    </v-dialog>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";
import { axiosInstance } from "@/common/store/auth";
import { Header } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";

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

const attendanceCheckTable = ref(true);

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
  studentNo: number;
  location: string;
  survey: boolean;
  late: boolean;
  offPosition: string;
  defPosition: string;
  checked: boolean;
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
    attendanceDate.value = item.date.slice(0, 10);
    attendanceItems.value = attendances;
    filteredAttendanceItems.value = [...attendances];
    attendanceCheckTable.value = false;
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
  { text: "체크하기", value: "check" },
];

const checkModal = ref(false);

const targetId = ref();
const targetName = ref();
const targetStudentNo = ref();
const targetLocation = ref();
const actualAttendance = ref();

async function getCheckModal(item: AttendanceDTO) {
  targetId.value = item.id;
  targetName.value = item.name;
  targetStudentNo.value = item.studentNo;
  targetLocation.value =
    item.location === "integrated"
      ? "통합"
      : item.location === "seoul"
      ? "명륜"
      : "율전";
  actualAttendance.value = item.late ? "늦참" : item.survey ? "참석" : "불참";
  checkModal.value = true;
}

type AttendanceCheckDTO = {
  id: number;
  location: string;
  late: boolean;
  survey: boolean;
  checked: boolean;
};

const resultModal = ref(false);
const checkResult = ref();
const checkTitle = ref();
const checkText = ref();

async function checkAttendance() {
  const data: AttendanceCheckDTO = {
    id: targetId.value,
    location:
      targetLocation.value === "통합"
        ? "integrated"
        : targetLocation.value === "명륜"
        ? "seoul"
        : "suwon",
    late: actualAttendance.value === "늦참" ? true : false,
    survey: actualAttendance.value === "불참" ? false : true,
    checked: true,
  };

  const result = await axiosInstance
    .put("/api/attendance/check", data)
    .then((result) => result.data)
    .catch((error) => {
      console.log(error);
      return false;
    });

  if (result) {
    attendanceItems.value.forEach((item) =>
      item.id === result.id ? (item.checked = true) : ""
    );
    checkResult.value = "success";
    checkTitle.value = "성공";
    checkText.value = "출석체크 성공";
  } else {
    checkResult.value = "error";
    checkTitle.value = "실패";
    checkText.value = "출석체크 실패";
  }
  checkModal.value = false;
  resultModal.value = true;
}
</script>

<style>
.attendance-date-table {
  --easy-table-header-font-size: 15px;
  --easy-table-header-height: 50px;
  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-font-weight: 700;

  --easy-table-body-row-hover-font-color: #e8eaf6;
  --easy-table-body-row-hover-background-color: #3949ab;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;
}
</style>
