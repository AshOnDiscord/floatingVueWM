<script setup lang="ts">
import { Vec2dImpl } from "@/types/Position";
import Direction from "@/types/Direction";

const props = defineProps<{
  outline: boolean;
}>();

const emits = defineEmits<{
  (e: "startResize", position: Vec2dImpl, direction: Direction): void;
  (e: "resize", position: Vec2dImpl, direction: Direction): void;
  (e: "stopResize", position: Vec2dImpl, direction: Direction): void;
}>();

let resizeController: AbortController | null = null;

const startResize = (event: MouseEvent, direction: Direction) => {
  if (event.button !== 0) return;

  event.preventDefault();

  emits("startResize", new Vec2dImpl(event.clientX, event.clientY), direction);

  resizeController = new AbortController();
  const { signal } = resizeController;

  window.addEventListener("mousemove", (event) => resize(event, direction), {
    signal,
  });
  window.addEventListener("mouseup", (event) => stopResize(event, direction), {
    signal,
  });
};

const resize = (event: MouseEvent, direction: Direction) => {
  if (resizeController?.signal.aborted) return;

  event.preventDefault();

  emits("resize", new Vec2dImpl(event.clientX, event.clientY), direction);
};

const stopResize = (event: MouseEvent, direction: Direction) => {
  if (resizeController?.signal.aborted || event.button !== 0) return;

  event.preventDefault();

  emits("stopResize", new Vec2dImpl(event.clientX, event.clientY), direction);
  resizeController?.abort();
  resizeController = null;
};
</script>
<template>
  <div class="h-full w-full bg-slate-200 outline outline-1 outline-slate-300">
    <main class="h-full overflow-scroll">
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates
        reprehenderit eius ex libero cupiditate corrupti impedit recusandae
        officia harum aperiam praesentium ipsum cumque laboriosam, illum
        dignissimos voluptatem rem quis doloribus.
      </p>
    </main>
    <div
      class="pointer-events-none absolute left-0 top-0 -m-2 grid h-[calc(100%+1rem)] w-[calc(100%+1rem)] grid-cols-[1rem,auto,1rem] grid-rows-[1rem,auto,1rem]"
    >
      <div
        :class="{
          'pointer-events-none': direction === Direction.empty,
          'pointer-events-auto': direction !== Direction.empty,
          'bg-red-500/25 outline outline-1 outline-red-500':
            props.outline && direction !== Direction.empty,
        }"
        :style="{ cursor: direction + '-resize' }"
        v-for="direction in Direction"
        :key="direction"
        @mousedown="(event) => startResize(event, direction)"
      ></div>
    </div>
  </div>
</template>
