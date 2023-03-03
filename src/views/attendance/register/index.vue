<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-10 py-5">
    <v-row>
      <v-dialog v-model="dialogDates" persistent>
        <v-card>
          <v-card-title class="ps-7 pt-8">
            <h3>운동정보 선택</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="formDates" @submit.prevent @submit="checkDateForm()">
              <v-container>
                <v-row v-for="(dateColumn, index) in dateColumns" :key="index">
                  <v-col cols="6">
                    <v-text-field
                      :label="dateColumn"
                      v-model="dateInfo[index].date"
                      type="date"
                      :rules="[(v) => !!v || '필수 입력 항목입니다']"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :label="dateColumn"
                      v-model="dateInfo[index].location"
                      :items="['통합', '개별']"
                      :rules="[(v) => !!v || '필수 입력 항목입니다']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-btn color="success" class="mt-4" block type="submit">
                      등록하기
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="error"
                      class="mt-4"
                      @click="() => ((dialogDates = false), (dialog = true))"
                      block
                    >
                      뒤로가기
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" persistent>
        <v-card>
          <v-card-title class="ps-7 pt-8">
            <h3>출석조사 등록</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent @submit="checkForm()">
              <v-text-field
                label="등록할 출석조사 파일 시트명"
                v-model="targetSheetName"
                readonly
              ></v-text-field>
              <v-select
                :items="targetColumns"
                v-model="nameColumn"
                :rules="[(v) => !!v || '필수선택 항목입니다']"
                label="이름을 나타내는 컬럼 선택*"
                class="mt-2"
                required
              ></v-select>
              <v-select
                :items="targetColumns"
                v-model="studentNoColumn"
                :rules="[(v) => !!v || '필수선택 항목입니다']"
                label="입학년도(학번)을 나타내는 컬럼 선택*"
                class="mt-2"
                required
              ></v-select>
              <v-autocomplete
                :items="targetColumns"
                v-model="dateColumns"
                :rules="[(v) => !!v || '필수선택 항목입니다']"
                label="출석 정보를 담고있는 컬럼 모두 선택*"
                class="mt-2"
                multiple
                required
              ></v-autocomplete>
              <v-select
                :items="targetColumns"
                v-model="reasonColumn"
                :rules="[(v) => !!v || '필수선택 항목입니다']"
                label="불참사유를 나타내는 컬럼 선택*"
                class="mt-2"
                required
              ></v-select>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-btn color="success" class="mt-4" block type="submit">
                      등록하기
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="error"
                      class="mt-4"
                      @click="() => (dialog = false)"
                      block
                    >
                      등록취소
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-col cols="12" md="8">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >구글폼 출석 조사 파일 선택
            <v-card-subtitle class="d-inline px-0"
              >| 최근 10개</v-card-subtitle
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
              <template #item-createdAt="item">
                {{ item.createdAt }}
              </template>
              <template #item-select="item">
                <v-btn
                  class="bg-green-darken-2"
                  @click="openForm(item)"
                  icon="fas fa-clipboard-check"
                  rounded="lg"
                  size="x-small"
                ></v-btn>
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="loading" :scrim="false" persistent width="auto">
      <v-card color="primary">
        <v-card-text>
          출석정보를 등록하는중입니다..
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="show"
      z-index="100005"
      location-strategy="static"
      persistent
    >
      <v-alert
        :type="registerResult"
        :title="registerTitle"
        :text="registerText"
        width="60%"
        border
        class="align-self-center"
      >
        <v-row class="mt-2">
          <v-col>
            <v-btn @click="() => (show = false)" class="bg-green-darken-4"
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

const dialog = ref(false);
const loading = ref(false);
const show = ref(false);

const icon = ref("fas fa-clipboard-check");
const title = ref("출석등록");
const breadcumbs = ref([
  {
    title: "출석관리",
    disabled: false,
  },
  {
    title: "출석등록",
    disabled: false,
  },
]);

const headers: Header[] = [
  { text: "시트명", value: "sheetName", sortable: true },
  { text: "생성시간", value: "createdAt", sortable: true },
  { text: "선택", value: "select" },
];

type GoogleSheet = {
  id: number;
  columns: string;
  createdAt: Date;
  records: string;
  sheetName: string;
};

const items: Ref<GoogleSheet[]> = ref([]);
const tableLoading = ref(true);

axiosInstance
  .get("/api/attendance/register")
  .then((result) => {
    items.value = result.data;
  })
  .catch((error) => {
    console.log(error);
    return false;
  })
  .finally(() => (tableLoading.value = false));

const targetSheetName = ref();
const targetColumns = ref();
const targetRecords = ref();

function openForm(item: GoogleSheet) {
  const targetColumn: string[] = JSON.parse(item.columns);
  const targetRecord = JSON.parse(item.records);

  targetSheetName.value = item.sheetName;
  targetColumns.value = targetColumn;
  targetRecords.value = targetRecord;
  dialog.value = true;
}

const nameColumn = ref();
const studentNoColumn = ref();
const dateColumns = ref();
const reasonColumn = ref();
const form = ref();

async function checkForm() {
  const result = await form.value.validate();
  if (result.valid) {
    await selectDates();
  }
}

async function selectDates() {
  dialog.value = false;
  dateInfo.value = new Array();
  dateColumns.value.forEach((value: string) => {
    dateInfo.value.push({
      column: value,
      date: undefined,
      location: undefined,
    });
  });
  dialogDates.value = true;
}

const dialogDates = ref(false);
const dateInfo = ref();
const formDates = ref();

async function checkDateForm() {
  const result = await formDates.value.validate();
  if (result.valid) {
    await check();
  }
}

const registerResult = ref();
const registerTitle = ref();
const registerText = ref();

async function check() {
  const registerPayload = new Array();
  targetRecords.value.forEach((item: any) => {
    dateColumns.value.forEach((dateColumn: string) => {
      const target = dateInfo.value.filter(
        (data: { column: string; date: string; location: string }) =>
          data.column === dateColumn
      );
      registerPayload.push({
        name: item[nameColumn.value],
        studentNo: item[studentNoColumn.value],
        survey: item[dateColumn].includes("불참") ? false : true,
        late: item[dateColumn].includes("늦참") ? true : false,
        location:
          target[0].location === "통합"
            ? "Integrated"
            : item[dateColumn].includes("명륜")
            ? "Seoul"
            : "Suwon",
        date: target[0].date,
        reason: item[reasonColumn.value],
      });
    });
    console.log(registerPayload);
  });

  loading.value = true;
  const result = await axiosInstance
    .post("/api/attendance/register", registerPayload)
    .then((result) => result.data)
    .catch((error) => {
      console.log(error);
      return false;
    })
    .finally(() => (loading.value = false));

  dialogDates.value = false;

  if (result) {
    registerResult.value = "success";
    registerTitle.value = "등록 성공";
    registerText.value = `총 ${result}개 등록되었습니다.`;
  } else {
    registerResult.value = "error";
    registerTitle.value = "등록 실패";
    registerText.value = `출석정보를 등록하지 못했습니다.`;
  }
  show.value = true;
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
