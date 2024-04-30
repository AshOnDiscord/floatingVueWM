<script setup lang="ts">
import { ref } from "vue";
import ResizeManager from "./ResizeManager.vue";
import TitleBarManager from "./TitleBarManager.vue";
import { Vec2dImpl } from "@/types/Position";

const position = ref(new Vec2dImpl(16, 12));
const size = ref(new Vec2dImpl(100, 100));

const MIN_SIZE = new Vec2dImpl(100, 100);
</script>
<template>
  <main
    class="absolute overflow-hidden rounded-lg bg-slate-200 shadow-lg"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
      width: size.x + 'px',
      height: size.y + 'px',
    }"
  >
    <ResizeManager
      :position="position"
      :size="size"
      :MIN_SIZE="MIN_SIZE"
      @positionChange="position = $event"
      @sizeChange="size = $event"
    />
    <TitleBarManager
      title="Window"
      icon="/vite.svg"
      :minimized="false"
      :maximized="false"
      :position="position"
      :size="size"
      @positionChange="position = $event"
    />
  </main>
</template>
