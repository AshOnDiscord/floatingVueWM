<script setup lang="ts">
import Direction, { DirectionGroups } from "@/types/Direction";
import { Vec2dImpl } from "@/types/Position";
import type { RectangleSides as RectSides } from "@/types/Sides";
import { RectangleSidesUtils as RSUtils } from "@/types/Sides";
import Resize from "@components/Window/Resize.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  outline: boolean;
}>();

const position = ref(new Vec2dImpl(16, 12));
const size = ref(new Vec2dImpl(100, 100));

const MIN_SIZE = new Vec2dImpl(100, 100);

const edges = computed({
  get: () => RSUtils.fromPositionAndSize(position.value, size.value),
  set: (value: RectSides) => {
    const newSize = RSUtils.toSize(value);
    if (newSize.x < MIN_SIZE.x || newSize.y < MIN_SIZE.y) {
      return alert("Past Bounds!");
    }

    position.value = Vec2dImpl.fromObject(RSUtils.toPosition(value));
    size.value = Vec2dImpl.fromObject(newSize);
  },
});

const resizeDirection = ref<Direction>(Direction.empty);
const startingEdges = ref<RectSides>(edges.value);

const startingPosition = ref<Vec2dImpl | null>(null);
const currentPosition = ref<Vec2dImpl | null>(null);

const cursorDifference = computed(() => {
  if (!startingPosition.value || !currentPosition.value) {
    return new Vec2dImpl(0, 0);
  }
  return currentPosition.value.sub(startingPosition.value);
});

const startResize = (position: Vec2dImpl, direction: Direction) => {
  resizeDirection.value = direction;
  startingEdges.value = edges.value;
  startingPosition.value = position;
};

const resize = (position: Vec2dImpl, _direction: Direction) => {
  currentPosition.value = position;

  const diff = cursorDifference.value;

  if (DirectionGroups.north.includes(resizeDirection.value)) {
    edges.value = RSUtils.setTopBounded(edges.value, {
      value: startingEdges.value.top + diff.y,
      min: 0,
      max: edges.value.bottom - MIN_SIZE.y,
    });
  } else if (DirectionGroups.south.includes(resizeDirection.value)) {
    edges.value = RSUtils.setBottomBounded(edges.value, {
      value: startingEdges.value.bottom + diff.y,
      min: edges.value.top + MIN_SIZE.y,
      max: window.innerHeight,
    });
  }

  if (DirectionGroups.west.includes(resizeDirection.value)) {
    edges.value = RSUtils.setLeftBounded(edges.value, {
      value: startingEdges.value.left + diff.x,
      min: 0,
      max: edges.value.right - MIN_SIZE.x,
    });
  } else if (DirectionGroups.east.includes(resizeDirection.value)) {
    edges.value = RSUtils.setRightBounded(edges.value, {
      value: startingEdges.value.right + diff.x,
      min: edges.value.left + MIN_SIZE.x,
      max: window.innerWidth,
    });
  }
};

const stopResize = (position: Vec2dImpl, _direction: Direction) => {
  currentPosition.value = position;
  startingPosition.value = null;
  resizeDirection.value = Direction.empty;
};
</script>
<template>
  <main
    class="absolute"
    :class="{ 'bg-red-500': props.outline }"
    :style="{
      top: position.y + 'px',
      left: position.x + 'px',
      width: size.x + 'px',
      height: size.y + 'px',
    }"
  >
    <Resize
      @startResize="startResize"
      @resize="resize"
      @stopResize="stopResize"
      :outline="props.outline"
    />
    <div class="absolute w-max">
      <p>Position: {{ position }}</p>
      <p>Size: {{ size }}</p>
      <p>Edges: {{ edges }}</p>
    </div>
  </main>
  <div class="absolute bottom-0 right-0">
    <p>Starting Position: {{ startingPosition || "(0, 0)" }}</p>
    <p>Current Position: {{ currentPosition || "(0, 0)" }}</p>
    <p>Cursor Difference: {{ cursorDifference }}</p>
    <p>Resize Direction: {{ resizeDirection || "Null" }}</p>
  </div>
</template>
