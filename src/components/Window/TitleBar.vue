<script setup lang="ts">
import {
  MinusIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import SquareIcon from "@components/SquareIcon.vue";
import { Vec2dImpl } from "@ts/Position";

const props = defineProps<{
  title: string;
  icon: string;
  maximized: boolean;
}>();

const emits = defineEmits<{
  /* Title Bar Buttons*/
  (e: "minimize"): void;
  (e: "maximize"): void;
  (e: "close"): void;
  /*  Dragging */
  (e: "startDragging", position: Vec2dImpl): void;
  (e: "dragging", position: Vec2dImpl): void;
  (e: "stopDragging", position: Vec2dImpl): void;
}>();

let dragController: AbortController | null = null;

const startDrag = (event: MouseEvent) => {
  if (event.button !== 0) return;

  event.preventDefault();

  emits("startDragging", new Vec2dImpl(event.clientX, event.clientY));

  dragController = new AbortController();
  const { signal } = dragController;

  window.addEventListener("mousemove", drag, { signal });
  window.addEventListener("mouseup", stopDrag, { signal });
};

const drag = (event: MouseEvent) => {
  if (dragController?.signal.aborted) return;

  event.preventDefault();

  emits("dragging", new Vec2dImpl(event.clientX, event.clientY));
};

const stopDrag = (event: MouseEvent) => {
  if (dragController?.signal.aborted || event.button !== 0) return;

  event.preventDefault();

  emits("stopDragging", new Vec2dImpl(event.clientX, event.clientY));
  dragController?.abort();
  dragController = null;
};
</script>
<template>
  <nav
    class="flex items-stretch justify-between overflow-hidden bg-slate-100"
    @mousedown="startDrag"
  >
    <div class="flex items-center px-2 py-1">
      <img :src="props.icon" alt="icon" class="h-4 w-4" />
      <span>{{ props.title }}</span>
    </div>
    <div class="flex items-stretch text-slate-600 *:px-2 *:py-1">
      <button
        class="transition-colors hover:bg-slate-200 hover:text-slate-900"
        aria-label="Minimize"
        @click="$emit('minimize')"
      >
        <MinusIcon class="h-4 w-4" />
      </button>
      <button
        class="transition-colors hover:bg-slate-200 hover:text-slate-900"
        aria-label="Maximize"
        @click="$emit('maximize')"
      >
        <Square2StackIcon v-if="maximized" class="h-4 w-4" />
        <SquareIcon v-else="" class="h-4 w-4" />
      </button>
      <button
        class="transition-colors hover:bg-red-500 hover:text-white"
        aria-label="Close"
        @click="$emit('close')"
      >
        <XMarkIcon class="h-4 w-4" />
      </button>
    </div>
  </nav>
</template>
