<script setup lang="ts">
import TitleBar from "@components/Window/TitleBar.vue";
import { Vec2dImpl } from "@ts/Position";
import { BoundedValueUtils as BVUtils } from "@/types/Sides";
import { computed, ref } from "vue";

const props = defineProps<{
  title: string;
  icon: string;
  minimized: boolean;
  maximized: boolean;
  position: Vec2dImpl;
  size: Vec2dImpl;
}>();

const emits = defineEmits<{
  (e: "minimize"): void;
  (e: "maximize"): void;
  (e: "close"): void;
  (e: "positionChange", position: Vec2dImpl): void;
}>();

const dragStart = ref<Vec2dImpl | null>(null);
const dragCurrent = ref<Vec2dImpl | null>(null);

const dragDistance = computed(() => {
  if (!dragStart.value || !dragCurrent.value) return new Vec2dImpl(0, 0);
  return dragCurrent.value.sub(dragStart.value);
});

const windowStart = ref(new Vec2dImpl(0, 0));

const startDragging = (position: Vec2dImpl) => {
  dragStart.value = position;
  windowStart.value = props.position;
};

const dragging = (position: Vec2dImpl) => {
  dragCurrent.value = position;

  const newPosition = windowStart.value.add(dragDistance.value);
  newPosition.x = BVUtils.bind({
    value: newPosition.x,
    min: 0,
    max: window.innerWidth - props.size.x,
  });
  newPosition.y = BVUtils.bind({
    value: newPosition.y,
    min: 0,
    max: window.innerHeight - 24,
  });

  emits("positionChange", newPosition);
};

const stopDragging = (position: Vec2dImpl) => {
  dragCurrent.value = position;
  dragStart.value = null;
};

const close = () => {
  emits("close");
};

const maximize = () => {
  emits("maximize");
};

const minimize = () => {
  emits("minimize");
};
</script>
<template>
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
</template>
