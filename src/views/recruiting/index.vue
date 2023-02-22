<template>
  <v-container class="fill-height px-5">
    <v-responsive class="d-flex text-center fill-height mt-3">
      <v-img contain height="130" src="@/assets/intro.svg" />
      <div class="text-h6 font-weight-black mt-5 text-amber-darken-1">
        성균관대학교 미식축구부 로얄스
      </div>

      <h1 class="text-subtitle-2 font-weight-bold text-grey-darken-1">
        2023년도 신입부원 모집
      </h1>

      <v-row class="d-flex align-content-center justify-center">
        <v-col cols="12" class="mt-5">
          <v-btn
            prepend-icon="fa-brands fa-facebook"
            size="large"
            rounded="lg"
            class="bg-red-accent-2"
            block
            href="https://www.facebook.com/skkuroyals"
            >FACEBOOK</v-btn
          >
        </v-col>
        <v-col cols="12" class="">
          <v-btn
            prepend-icon="fa-brands fa-instagram"
            size="large"
            rounded="lg"
            class="bg-light-green-darken-2"
            block
            href="https://www.instagram.com/skku_royals_1957"
            >INSTAGRAM</v-btn
          >
        </v-col>
        <v-col cols="12" class="">
          <v-btn
            prepend-icon="fa-brands fa-youtube"
            size="large"
            rounded="lg"
            class="bg-blue-accent-2"
            block
            href="https://www.youtube.com/@skkuroyals1258"
            >HIGHLIGHTS</v-btn
          >
        </v-col>
        <v-col cols="12" class="">
          <v-btn
            prepend-icon="fas fa-trophy"
            size="large"
            rounded="lg"
            class="bg-deep-purple-accent-2"
            block
            @click="() => (dialog = !dialog)"
            >RECORDS</v-btn
          >
        </v-col>
      </v-row>
      <v-footer
        ><v-col class="text-center mt-4" cols="12">
          © {{ new Date().getFullYear() }} <strong>SKKU ROYALS</strong>
        </v-col></v-footer
      >
    </v-responsive>
    <div class="text-center">
      <v-dialog v-model="dialog">
        <v-card class="text-center">
          <v-card-text>
            <h3 class="mb-3">SKKU ROYALS RECORDS</h3>
            2022년도 전국 대회 우승<br />
            2022년도 서울지역 추계 대회 우승<br />
            2022년도 서울지역 춘계 대회 우승<br />
            2021년도 서울지역 추계 대회 준우승<br />
            2019년도 전국 대회 준우승<br />
            2019년도 서울지역 춘계 대회 우승<br />
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              class="bg-amber-accent-3 text-white"
              @click="dialog = false"
              >닫기</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const dialog = ref(false);
</script>
