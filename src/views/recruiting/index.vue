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
        <v-col cols="12" class="mt-5 py-2">
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
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fa-brands fa-youtube"
            size="large"
            rounded="lg"
            class="bg-amber-accent-2 text-white"
            block
            href="https://youtu.be/7VaA41gZgAE"
            >HIGHLIGHTS</v-btn
          >
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fa-brands fa-youtube"
            size="large"
            rounded="lg"
            class="bg-amber-accent-2 text-white"
            block
            href="https://youtu.be/sYT4eKDSgXo"
            >ROSTER</v-btn
          >
        </v-col>
        <v-col cols="12" class="py-2">
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
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fas fa-person"
            size="large"
            rounded="lg"
            class="bg-blue-accent-2"
            to="/recruiting/fbti"
            block
            >FBTI (풋볼TI)</v-btn
          >
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fas fa-trophy"
            size="large"
            rounded="lg"
            class="bg-deep-purple-accent-2"
            block
            @click="() => (records = !records)"
            >RECORDS</v-btn
          >
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fas fa-newspaper"
            size="large"
            rounded="lg"
            class="bg-orange-accent-3 text-white"
            block
            @click="() => (cardnews = !cardnews)"
            >CARD NEWS</v-btn
          >
        </v-col>
        <v-col cols="12" class="py-2">
          <v-btn
            prepend-icon="fas fa-envelope"
            size="large"
            rounded="lg"
            class="bg-cyan-accent-4 text-white"
            href="https://forms.gle/ywwo8QS4iyhs4mA89"
            block
            >CONTACT</v-btn
          >
        </v-col>
        <v-col class="text-center mt-1" cols="12">
          © {{ new Date().getFullYear() }} <strong>SKKU ROYALS</strong>
        </v-col>
      </v-row>
    </v-responsive>
    <div class="text-center">
      <v-dialog v-model="records">
        <v-card class="text-center">
          <v-card-text class="font-weight-regular">
            <h3 class="mb-3 font-weight-black">
              <v-icon
                class="fas fa-football text-brown-darken-1"
                size="20px"
              ></v-icon>
              SKKU ROYALS RECORDS
            </h3>
            <v-icon
              icon="fas fa-medal"
              class="text-amber-darken-1"
              size="17px"
            ></v-icon>
            2022년도 전국 대회 우승<br />
            <v-icon
              icon="fas fa-medal"
              class="text-amber-darken-1"
              size="17px"
            ></v-icon>
            2022년도 서울지역 추계 대회 우승<br />
            <v-icon
              icon="fas fa-medal"
              class="text-amber-darken-1"
              size="17px"
            ></v-icon>
            2022년도 서울지역 춘계 대회 우승<br />
            <v-icon
              icon="fas fa-medal"
              class="text-grey-darken-1"
              size="17px"
            ></v-icon>
            2021년도 서울지역 추계 대회 준우승<br />
            <v-icon
              icon="fas fa-medal"
              class="text-amber-darken-1"
              size="17px"
            ></v-icon>
            2019년도 전국 대회 우승<br />
            <v-icon
              icon="fas fa-medal"
              class="text-amber-darken-1"
              size="17px"
            ></v-icon>
            2019년도 서울지역 춘계 대회 우승<br />
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              class="bg-amber-accent-3 text-white"
              @click="records = false"
              >닫기</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="cardnews">
      <v-carousel hide-delimiters show-arrows="hover" cycle interval="3000">
        <v-carousel-item
          v-for="(cardnewsUrl, i) in cardnewsUrls"
          :key="i"
          :src="cardnewsUrl.src"
        >
        </v-carousel-item>
      </v-carousel>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const records = ref(false);
const cardnews = ref(false);

const cardnewsUrls = ref([
  { src: "/cardnews/001.png" },
  { src: "/cardnews/002.png" },
  { src: "/cardnews/003.png" },
  { src: "/cardnews/004.png" },
  { src: "/cardnews/005.png" },
  { src: "/cardnews/006.png" },
  { src: "/cardnews/007.png" },
  { src: "/cardnews/008.png" },
  { src: "/cardnews/009.png" },
  { src: "/cardnews/010.png" },
]);
</script>
