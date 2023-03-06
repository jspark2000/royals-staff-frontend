<template>
  <bread-crumb :title="title" :items="breadcumbs" :icon="icon" />
  <v-responsive class="d-flex px-10 py-5">
    <v-row>
      <v-col cols="6">
        <v-card class="pa-2" elevation="3">
          <v-card-title class="text-indigo-darken-4"
            >부원 등록하기</v-card-title
          >
          <v-form @submit.prevent @submit="registerPeople()" class="pa-5">
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
            <v-btn type="submit" block class="bg-amber-lighten-2"
              >등록하기</v-btn
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
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
import { ref } from "vue";
import BreadCrumb from "@/components/Breadcrumbs.vue";
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

const snackbar = ref(false);

const successModal = ref(false);
const errorModal = ref(false);
const modal = ref(false);
const name = ref();
const studentNo = ref();

async function registerPeople() {
  const registerDTO = {
    name: name.value.trim(),
    studentNo: studentNo.value,
  };

  const result = await axiosInstance
    .post("/api/admin/people", registerDTO)
    .then((result) => result.data)
    .catch(() => {
      errorModal.value = true;
      return false;
    })
    .finally(() => (modal.value = false));

  if (result) {
    successModal.value = true;
  }
}
</script>
