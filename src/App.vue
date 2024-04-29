<script setup lang="ts">
import TitleBarManager from "@components/Window/TitleBarManager.vue";
import ResizeManager from "@components/Window/ResizeManager.vue";
import { ref } from "vue";

const titleBar = ref(true);
const outline = ref(false);
</script>
<template>
  <TitleBarManager v-if="titleBar" />
  <ResizeManager v-else :outline="outline" />
  <div class="absolute bottom-0 left-0 m-4 flex gap-4">
    <button
      class="rounded-lg bg-sky-500 px-3 py-2 font-semibold text-white shadow-md ring-offset-2 transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-sky-500"
      @click="titleBar = !titleBar"
    >
      Swap
      <br />
      Demo</button
    ><button
      class="rounded-lg bg-sky-500 px-3 py-2 font-semibold text-white shadow-md ring-offset-2 transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-sky-500"
      v-if="!titleBar"
      @click="outline = !outline"
    >
      Enable
      <br />
      Outline
    </button>
  </div>
</template>
