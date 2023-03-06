<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-10 py-5">
    <v-row>
      <v-col cols="8">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >밴드 계정 테이블
            <v-card-subtitle class="d-inline px-0"
              >| {{ season }} season</v-card-subtitle
            ></v-card-title
          >
          <v-card-text class="font-weight-medium mt-lg-3">
            <EasyDataTable
              :headers="headers"
              :items="items"
              :rows-per-page="10"
              table-class-name="band-user-table"
              theme-color="#1d90ff"
              show-index
              alternating
            >
              <template #item-profileUrl="item">
                <v-avatar size="30px">
                  <v-img :src="item.profileUrl"></v-img>
                </v-avatar>
              </template>
              <template #item-register="item">
                <v-btn
                  @click="getRegisterModal(item)"
                  class="bg-red-darken-3"
                  :class="{ 'bg-green-darken-2': !item.registered }"
                  ><v-icon icon="fas fa-user-plus" size="12px"></v-icon
                ></v-btn>
              </template>
            </EasyDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" width="auto">
      <v-sheet width="300" class="mx-auto pa-10">
        <v-form @submit.prevent @submit="registerPeople()">
          <v-text-field
            v-model="targetId"
            variant="outlined"
            label="id"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="name"
            variant="outlined"
            label="이름"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="studentNo"
            variant="outlined"
            type="number"
            label="입학년도"
          ></v-text-field>
          <v-btn type="submit" block class="bg-amber-lighten-2">등록하기</v-btn>
          <v-btn
            @click="() => (modal = false)"
            block
            class="mt-3 bg-green-lighten-2"
            >뒤로가기</v-btn
          >
        </v-form>
      </v-sheet>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="red-darken-4"
      elevation="24"
      >이미 등록된 유저입니다.</v-snackbar
    >
    <v-dialog v-model="errorModal" width="auto">
      <v-alert type="error" title="ERROR" border>
        요청을 처리하는중 오류가 발생했습니다.
      </v-alert>
    </v-dialog>
    <v-dialog v-model="successModal" width="auto">
      <v-alert type="success" title="SUCCESS" border>
        성공적으로 등록했습니다.
      </v-alert>
    </v-dialog>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref, Ref, watchEffect } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";
import { Header } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import { axiosInstance } from "@/common/store/auth";

const icon = ref("fas fa-people-group");
const title = ref("부원등록");
const breadcumbs = ref([
  {
    title: "부원관리",
    disabled: false,
  },
  {
    title: "부원등록",
    disabled: false,
  },
]);

const season = ref(new Date().getFullYear());

const snackbar = ref(false);

type BandUserResponseDTO = {
  id: number;
  userNickname: string;
  profileUrl: string;
  registered: boolean;
};

const items: Ref<BandUserResponseDTO[]> = ref([]);
const headers: Header[] = [
  { text: "밴드 프로필", value: "profileUrl" },
  { text: "밴드 닉네임", value: "userNickname" },
  { text: "등록하기", value: "register" },
];

watchEffect(async () => {
  const bandUsers: BandUserResponseDTO[] = await axiosInstance
    .get("/api/band/user/list")
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

  if (bandUsers) {
    items.value = bandUsers;
  }
});

const successModal = ref(false);
const errorModal = ref(false);
const modal = ref(false);
const targetId = ref();
const name = ref();
const studentNo = ref();

async function getRegisterModal(item: BandUserResponseDTO) {
  if (item.registered) {
    snackbar.value = true;
  } else {
    targetId.value = item.id;
    name.value = item.userNickname;
    studentNo.value = season.value;
    modal.value = true;
  }
}

async function registerPeople() {
  const updateDTO = {
    id: targetId.value,
    name: name.value.trim(),
    studentNo: studentNo.value,
  };

  const result = await axiosInstance
    .post("/api/admin/people", updateDTO)
    .then((result) => result.data)
    .catch(() => {
      errorModal.value = true;
      return false;
    })
    .finally(() => (modal.value = false));

  console.log(result);

  if (result) {
    items.value.forEach((item) => {
      if (item.id === updateDTO.id) {
        item.registered = true;
      }
    });
    successModal.value = true;
  }
}
</script>
<style>
.band-user-table {
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
