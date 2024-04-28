<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  MinusIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import SquareIcon from "./SquareIcon.vue";

const emit = defineEmits<{
  (e: "minimize", id: string): void;
  (e: "close", id: string): void;
}>();

const { props, children } = defineProps<{
  props: {
    id: string;
    title: string;
    icon: string;
  };
  minimized: boolean;
  children: any;
}>();

const isMaximized = ref(false);

const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const MIN_SIZE = {
  width: 250,
  height: 100,
};

const size = ref<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

const window = ref<HTMLElement | null>(null);

const resize = {
  eventListenerController: null as AbortController | null,
  startingEdges: null as {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null,
  newEdges: null as {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null,
  clickStart: null as { x: number; y: number } | null,
  mount: () => {
    Object.entries(resize.refs).forEach(([key, value]) => {
      // console.log(value.value, key);
      if (!value.value) return;
      value.value.addEventListener("mousedown", (event) => {
        resize.mouseDown(event, key);
      });
    });
  },
  mouseDown: (event: MouseEvent, key: string) => {
    if (event.button != 0) return;
    event.preventDefault();
    resize.startingEdges = {
      left: position.value.x,
      top: position.value.y,
      right: position.value.x + size.value.width,
      bottom: position.value.y + size.value.height,
    };
    resize.newEdges = { ...resize.startingEdges };
    resize.clickStart = { x: event.clientX, y: event.clientY };
    resize.eventListenerController = new AbortController();
    document.addEventListener(
      "mousemove",
      (event) => {
        resize.mouseMove(event, key);
      },
      { signal: resize.eventListenerController.signal },
    );
    document.addEventListener(
      "mouseup",
      (event) => {
        resize.mouseUp(event, key);
      },
      { signal: resize.eventListenerController.signal },
    );
  },
  mouseMove: (event: MouseEvent, key: string) => {
    if (
      resize.startingEdges == null ||
      resize.newEdges == null ||
      resize.clickStart == null ||
      !resize.refs[key as keyof typeof resize.refs].value
    ) {
      return;
    }
    event.preventDefault();
    console.log("mouseMove", key);

    if (key.toLowerCase().includes("north")) {
      resize.newEdges.top = Math.max(
        resize.startingEdges.top + event.clientY - resize.clickStart.y,
        0,
      );
      const newHeight = resize.newEdges.bottom - resize.newEdges.top;
      const diff = newHeight - MIN_SIZE.height;
      if (diff < 0) {
        resize.newEdges.top += diff;
      }
    } else if (key.toLowerCase().includes("south")) {
      resize.newEdges.bottom = Math.min(
        resize.startingEdges.bottom + event.clientY - resize.clickStart.y,
        document.body.clientHeight -
          document.getElementById("taskbar")!.clientHeight,
      );
    }

    if (key.toLowerCase().includes("west")) {
      resize.newEdges.left = Math.max(
        resize.startingEdges.left + event.clientX - resize.clickStart.x,
        0,
      );
      const newWidth = resize.newEdges.right - resize.newEdges.left;
      const diff = newWidth - MIN_SIZE.width;
      if (diff < 0) {
        resize.newEdges.left += diff;
      }
    } else if (key.toLowerCase().includes("east")) {
      resize.newEdges.right = Math.min(
        resize.startingEdges.right + event.clientX - resize.clickStart.x,
        document.body.clientWidth,
      );
    }
    resize.update();
  },
  update: () => {
    if (resize.newEdges == null || resize.startingEdges == null) return;
    position.value = {
      x: Math.max(resize.newEdges.left, 0),
      y: Math.max(resize.newEdges.top, 0),
    };
    size.value = {
      width: Math.min(
        Math.max(resize.newEdges.right - resize.newEdges.left, MIN_SIZE.width),
        document.body.clientWidth,
      ),
      height: Math.min(
        Math.max(resize.newEdges.bottom - resize.newEdges.top, MIN_SIZE.height),
        document.body.clientHeight -
          document.getElementById("taskbar")!.clientHeight,
      ),
    };
  },
  mouseUp: (event: MouseEvent, key: string) => {
    if (event.button != 0 || resize.startingEdges == null) return;
    console.log("mouseUp", key);
    event.preventDefault();
    resize.startingEdges = null;
    resize.newEdges = null;
    resize.clickStart = null;
    if (resize.eventListenerController) {
      resize.eventListenerController.abort();
      resize.eventListenerController = null;
    }
  },
  refs: {
    northWest: ref<HTMLElement | null>(null),
    north: ref<HTMLElement | null>(null),
    northEast: ref<HTMLElement | null>(null),
    west: ref<HTMLElement | null>(null),
    east: ref<HTMLElement | null>(null),
    southWest: ref<HTMLElement | null>(null),
    south: ref<HTMLElement | null>(null),
    southEast: ref<HTMLElement | null>(null),
  },
};

const titleBar = ref<HTMLElement | null>(null);

const drag: {
  startingMouse: { x: number; y: number } | null;
  startingPosition: { x: number; y: number } | null;
  mouseDown: (event: MouseEvent) => void;
  mouseMove: (event: MouseEvent) => void;
  mouseUp: (event: MouseEvent) => void;
} = {
  startingMouse: null,
  startingPosition: null,
  mouseDown: (event: MouseEvent) => {
    if (event.button != 0) return;
    event.preventDefault();
    console.log("mouseDown");
    drag.startingMouse = { x: event.clientX, y: event.clientY };
    drag.startingPosition = position.value;
    document.addEventListener("mousemove", drag.mouseMove);
    document.addEventListener("mouseup", drag.mouseUp);
  },
  mouseMove: (event: MouseEvent) => {
    if (!drag.startingMouse || !drag.startingPosition) return;
    event.preventDefault();
    position.value = {
      x: Math.min(
        Math.max(
          drag.startingPosition.x + event.clientX - drag.startingMouse.x,
          0,
        ),
        document.body.clientWidth - size.value.width,
      ),
      y: Math.min(
        Math.max(
          drag.startingPosition.y + event.clientY - drag.startingMouse.y,
          0,
        ),
        document.body.clientHeight -
          size.value.height -
          document.getElementById("taskbar")!.clientHeight,
      ),
    };
    console.log("mouseMove");
  },
  mouseUp: (event: MouseEvent) => {
    if (event.button != 0 || !drag.startingMouse || !drag.startingPosition) {
      return;
    }
    event.preventDefault();
    drag.startingMouse = null;
    drag.startingPosition = null;
    console.log("mouseUp");
    document.removeEventListener("mousemove", drag.mouseMove);
    document.removeEventListener("mouseup", drag.mouseUp);
  },
};

watch(
  () => position.value,
  (value) => {
    updatePosition(value);
  },
);

const updatePosition = (value: { x: number; y: number }) => {
  if (!window.value) return;
  window.value.style.left = `${value.x}px`;
  window.value.style.top = `${value.y}px`;
};

watch(
  () => size.value,
  (value) => {
    updateSize(value);
  },
);

const updateSize = (value: { width: number; height: number }) => {
  if (!window.value) return;
  window.value.style.width = `${value.width}px`;
  window.value.style.height = `${value.height}px`;
};

onMounted(() => {
  updatePosition(position.value);
  size.value = {
    width: document.body.clientWidth / 2,
    height: document.body.clientHeight / 2,
  };
  updateSize(size.value);
  resize.mount();
});
</script>

<template>
  <div
    class="absolute grid grid-rows-[min-content,auto] bg-white"
    :class="{
      '!left-0 !top-0 !h-full !w-full rounded-none shadow-none': isMaximized,
      'rounded-lg shadow-md': !isMaximized,
      hidden: minimized,
    }"
    ref="window"
  >
    <nav
      class="flex justify-between overflow-hidden rounded-t-lg bg-slate-200"
      @mousedown="drag.mouseDown"
      ref="titleBar"
    >
      <div class="flex items-center gap-2 px-2 py-1">
        <img :src="props.icon" class="h-4 w-4" />
        <span>{{ props.title }}</span>
      </div>
      <ul class="grid grid-cols-3 text-slate-600">
        <li class="flex items-center justify-center">
          <button
            class="h-full w-full px-2 py-1 hover:bg-slate-300"
            @click="() => $emit('minimize', props.id)"
          >
            <MinusIcon class="h-4 w-4" />
          </button>
        </li>
        <li class="flex items-center justify-center">
          <button
            class="h-full w-full px-2 py-1 hover:bg-slate-300"
            @click="() => (isMaximized = !isMaximized)"
          >
            <Square2StackIcon class="h-4 w-4" v-if="isMaximized" />
            <SquareIcon class="h-4 w-4" v-else />
          </button>
        </li>
        <li class="flex items-center justify-center">
          <button
            class="h-full w-full px-2 py-1 hover:bg-slate-300"
            @click="() => $emit('close', props.id)"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
    <main class="overflow-hidden rounded-b-lg py-1 pl-2 pr-1">
      <div class="h-full overflow-scroll pr-1">
        <component :is="children" />
      </div>
    </main>
    <div
      class="pointer-events-none absolute left-0 top-0 -m-2 grid h-[calc(100%+1rem)] w-[calc(100%+1rem)] grid-cols-[1rem,auto,1rem] grid-rows-[1rem,auto,1rem] *:pointer-events-auto"
    >
      <div class="cursor-nw-resize" :ref="resize.refs.northWest"></div>
      <div class="cursor-n-resize" :ref="resize.refs.north"></div>
      <div class="cursor-ne-resize" :ref="resize.refs.northEast"></div>
      <div class="cursor-w-resize" :ref="resize.refs.west"></div>
      <span class="!pointer-events-none invisible"></span>
      <div class="cursor-e-resize" :ref="resize.refs.east"></div>
      <div class="cursor-sw-resize" :ref="resize.refs.southWest"></div>
      <div class="cursor-s-resize" :ref="resize.refs.south"></div>
      <div class="cursor-se-resize" :ref="resize.refs.southEast"></div>
    </div>
  </div>
</template>
