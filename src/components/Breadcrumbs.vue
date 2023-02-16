<template>
  <v-responsive class="d-flex px-10 py-5">
    <v-row align="center">
      <v-col cols="4" class="font-weight-bold text-h6">
        {{ props.title }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="8">
        <v-breadcrumbs :items="props.items" class="justify-end text-subtitle-2">
          <template v-slot:prepend>
            <v-icon size="small" :icon="props.icon"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-responsive>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: String,
  title: String,
  items: Array,
});
</script>

<style scoped></style>
