<script setup lang="ts">
import { MinusIcon, Square2StackIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import { onMounted, ref } from "vue"
import WindowData from "../ts/WindowData"

const props = defineProps<{
  data: WindowData
  windows: WindowData[]
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const element = ref<HTMLElement | null>(null)
const titleBar = ref<HTMLElement | null>(null)

onMounted(() => {
  props.data.updateElement(element.value!)
  props.data.updateTitleBar(titleBar.value!)
  props.data.onMounted()
})

</script>

<template>
  <div
    class="window border-slate-200 border-2 shadow absolute bg-white resize overflow-hidden min-w-48 min-h-32 grid grid-rows-[auto,1fr]"
    ref="element" @mousedown="(event) => props.data.listeners.onMouseDown(event, props.windows)">
    <nav class="flex justify-between bg-slate-200 px-2 py-1 text-slate-800" ref="titleBar"
      @mousedown="(event) => props.data.dragListeners.onMouseDown(event, props.windows)"
      @dblclick="props.data.dragListeners.onDoubleClick">
      <div class="flex gap-2">
        <img :src="props.data.icon" alt="" class="w-6 h-6">
        <span>{{ props.data.title }}</span>
      </div>
      <!-- Prevent bubbling -->
      <div class="text-slate-600 *:rounded-full *:p-1" @click="(e) => e.preventDefault()">
        <button class="hover:bg-green-500 hover:text-white"
          @click="() => props.data.titleButtons.minimize(props.windows)">
          <MinusIcon class="w-4 h-4" />
        </button>
        <button class="hover:bg-yellow-500 hover:text-white" @click="props.data.titleButtons.maximize">
          <Square2StackIcon class="w-4 h-4" v-if="!props.data.maximized" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" class="w-4 h-4" v-else>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M 7.5 14.25 M 6 20.25 h 12 A 2.25 2.25 0 0 0 20.25 18 V 6 A 2.25 2.25 0 0 0 18 3.75 H 6 A 2.25 2.25 0 0 0 3.75 6 v 12 A 2.25 2.25 0 0 0 6 20.25 Z" />
          </svg>
        </button>

        <button class="hover:bg-red-500 hover:text-white" @click="emit('close')">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </nav>
    <main class="overflow-scroll">
      <slot></slot>
    </main>
  </div>
</template>