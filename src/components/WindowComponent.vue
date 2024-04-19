<script setup lang="ts">
import { ref } from 'vue';
import { MinusIcon, Square2StackIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import SquareIcon from "./SquareIcon.vue"

const { props, children } = defineProps<{
  props: {
    id: string
    title: string
    icon: string
  }
  children: any
}>();

const isMaximized = ref(false)

</script>

<template>
  <div class="absolute bg-white grid grid-rows-[min-content,auto] rounded-lg overflow-hidden"
    :class="{ 'w-full h-full rounded-none shadow-none top-0 left-0': isMaximized, 'w-1/2 h-1/2 rounded-lg shadow-md top-11 left-12': !isMaximized }">
    <nav class="flex justify-between bg-slate-200">
      <div class="flex gap-2  px-2 py-1">
        <img :src="props.icon" class="h-6 w-6" />
        <span>{{ props.title }}</span>
      </div>
      <ul class="grid grid-cols-3 text-slate-600">
        <li class="flex justify-center items-center">
          <button class="px-2 py-1 hover:bg-slate-300 w-full h-full">
            <MinusIcon class="w-4 h-4" />
          </button>
        </li>
        <li class="flex justify-center items-center">
          <button class="px-2 py-1 hover:bg-slate-300 w-full h-full" @click="() => isMaximized = !isMaximized">
            <Square2StackIcon class="w-4 h-4" v-if="isMaximized" />
            <SquareIcon class="w-4 h-4" v-else />
          </button>
        </li>
        <li class="flex justify-center items-center">
          <button class="px-2 py-1 hover:bg-slate-300 w-full h-full">
            <XMarkIcon class="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
    <main class="overflow-hidden pl-2 pr-1 py-1 ">
      <div class="overflow-scroll h-full pr-1">
        <component :is="children" />
      </div>
    </main>
  </div>
</template>;
