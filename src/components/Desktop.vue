<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/16/solid';
</script>

<template>
  <ul id="desktop"
    class="grid grid-cols-[repeat(auto-fill,5rem)] grid-rows-[repeat(auto-fill,6rem)] w-screen h-full grid-flow-col gap-2 py-2">
    <li v-for="_ in 10">
      <button class="flex flex-col items-center justify-start hover:!bg-white/10 p-1 focus:bg-white/20">
        <TrashIcon class="h-8 w-8 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
        <p class="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-center">Recycle Bin</p>
      </button>
    </li>
  </ul>
</template>