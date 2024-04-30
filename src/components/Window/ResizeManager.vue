<script setup lang="ts">
import Direction, { DirectionGroups } from "@/types/Direction";
import { Vec2dImpl } from "@/types/Position";
import type { RectangleSides as RectSides } from "@/types/Sides";
import { RectangleSidesUtils as RSUtils } from "@/types/Sides";
import Resize from "@components/Window/Resize.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  position: Vec2dImpl;
  size: Vec2dImpl;
  MIN_SIZE: Vec2dImpl;
}>();

const emits = defineEmits<{
  (e: "positionChange", position: Vec2dImpl): void;
  (e: "sizeChange", size: Vec2dImpl): void;
}>();

const edges = computed({
  get: () => RSUtils.fromPositionAndSize(props.position, props.size),
  set: (value: RectSides) => {
    const newSize = RSUtils.toSize(value);
    if (newSize.x < props.MIN_SIZE.x || newSize.y < props.MIN_SIZE.y) {
      return alert("Past Bounds!");
    }

    emits("positionChange", Vec2dImpl.fromObject(RSUtils.toPosition(value)));
    emits("sizeChange", Vec2dImpl.fromObject(newSize));
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

  let localEdges = edges.value;

  const diff = cursorDifference.value;

  if (DirectionGroups.north.includes(resizeDirection.value)) {
    localEdges = RSUtils.setTopBounded(localEdges, {
      value: startingEdges.value.top + diff.y,
      min: 0,
      max: edges.value.bottom - props.MIN_SIZE.y,
    });
  } else if (DirectionGroups.south.includes(resizeDirection.value)) {
    localEdges = RSUtils.setBottomBounded(localEdges, {
      value: startingEdges.value.bottom + diff.y,
      min: edges.value.top + props.MIN_SIZE.y,
      max: window.innerHeight,
    });
  }

  if (DirectionGroups.west.includes(resizeDirection.value)) {
    localEdges = RSUtils.setLeftBounded(localEdges, {
      value: startingEdges.value.left + diff.x,
      min: 0,
      max: edges.value.right - props.MIN_SIZE.x,
    });
  } else if (DirectionGroups.east.includes(resizeDirection.value)) {
    localEdges = RSUtils.setRightBounded(localEdges, {
      value: startingEdges.value.right + diff.x,
      min: edges.value.left + props.MIN_SIZE.x,
      max: window.innerWidth,
    });
  }

  edges.value = localEdges;
};

const stopResize = (position: Vec2dImpl, _direction: Direction) => {
  currentPosition.value = position;
  startingPosition.value = null;
  resizeDirection.value = Direction.empty;
};
</script>
<template>
  <Resize
    @startResize="startResize"
    @resize="resize"
    @stopResize="stopResize"
  />
</template>
