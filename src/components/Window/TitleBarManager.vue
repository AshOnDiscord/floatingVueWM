<script setup lang="ts">
import TitleBar from "@components/Window/TitleBar.vue";
import { Vec2dImpl } from "@ts/Position";
import { computed, ref } from "vue";

const window = ref<HTMLElement | null>(null);

const title = ref("Vue.js");
const icon = ref("/vite.svg");
const minimized = ref(false);
const maximized = ref(false);

const dragStart = ref<Vec2dImpl | null>(null);
const dragCurrent = ref<Vec2dImpl | null>(null);

const dragDistance = computed(() => {
  if (!dragStart.value || !dragCurrent.value) return new Vec2dImpl(0, 0);
  return dragCurrent.value.sub(dragStart.value);
});

const windowPosition = ref(new Vec2dImpl(16, 12));
const windowStart = ref(new Vec2dImpl(0, 0));

const startDragging = (position: Vec2dImpl) => {
  dragStart.value = position;
  windowStart.value = windowPosition.value;
};

const dragging = (position: Vec2dImpl) => {
  dragCurrent.value = position;
  windowPosition.value = windowStart.value.add(dragDistance.value);
};

const stopDragging = (position: Vec2dImpl) => {
  dragCurrent.value = position;
  dragStart.value = null;
};

const close = () => {
  alert(
    "Emit is implemented but not actual closing is implemented in the manager.",
  );
};

const maximize = () => {
  maximized.value = !maximized.value;
  alert(
    "the emit is fired and recieved (hence how the boolean is toggled) but the window is not actually maximized because I'm lazy",
  );
};

const minimize = () => {
  minimized.value = !minimized.value;
  alert("kekw no taskbar so you can't unminimized w/o vue dev tools lol");
};
</script>
<template>
  <main
    ref="window"
    class="absolute"
    :style="{ top: windowPosition.y + 'px', left: windowPosition.x + 'px' }"
  >
    <TitleBar
      :title="title"
      :icon="icon"
      :maximized="maximized"
      :class="{
        'rounded-t-lg': !maximized,
        hidden: minimized,
      }"
      @minimize="minimize"
      @maximize="maximize"
      @close="close"
      @start-dragging="startDragging"
      @dragging="dragging"
      @stop-dragging="stopDragging"
    />
    <div class="absolute w-max">
      <div>
        <p>Start: {{ dragStart || "(0, 0)" }}</p>
        <p>Current: {{ dragCurrent }}</p>
        <p>Distance: {{ dragDistance }}</p>
      </div>
      <div>
        <p>maximized: {{ maximized }}</p>
      </div>
    </div>
  </main>
  <div class="absolute bottom-0 right-0">
    <p>Window Position: {{ windowPosition }}</p>
    <p>Drag Start: {{ windowStart }}</p>
  </div>
</template>
