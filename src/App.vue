<script setup lang="ts">
import Window from './components/Window.vue'
import WindowData from './ts/WindowData';
import { ref } from 'vue'
import type { Ref } from 'vue'

// Ignore the type error, typescript bugging out
// @ts-ignore
const windows: Ref<WindowData[]> = ref<WindowData[]>([
  new WindowData('Vue.js', 'https://vuejs.org/images/logo.png'),
  new WindowData('Vue.js 2', 'https://vuejs.org/images/logo.png')
])

const close = (windowData: WindowData) => {
  windowData.titleButtons.close()
  const index = windows.value.indexOf(windowData)
  if (index !== -1) {
    windows.value = windows.value.filter((_, i) => i !== index)
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden grid grid-rows-[1fr,min-content]">
    <div class="overflow-hidden relative w-screen" id="windowSpace">
      <Window v-for="windowData in windows" :data="windowData" :windows="windows" :key="windowData.id"
        @close="() => close(windowData)">
        <div class="px-2 py-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus delectus expedita eius fugiat iure
          possimus nisi dolor quo distinctio natus illum quibusdam error earum aliquam blanditiis deleniti nulla
          aperiam,
          ratione recusandae, quia est. Recusandae atque obcaecati tempore, ratione labore incidunt nihil sit! Et
          impedit
          eveniet, enim deserunt unde ipsa nisi facere exercitationem reiciendis pariatur iusto odio eligendi
          repudiandae
          rem provident numquam quos non inventore modi? Quos, tempora dolorum, perspiciatis dolor illum pariatur natus
          minus quis modi nostrum numquam in ipsa? Earum debitis expedita labore voluptas necessitatibus quis harum non
          fugit odio praesentium assumenda, rerum corrupti eius nihil cum nobis obcaecati!
        </div>
      </Window>
    </div>
    <nav class="bg-slate-200 px-4 py-2">
      <ul class="flex gap-2">
        <li v-for="windowData in  windows " :key="windowData.id">
          <button class="bg-slate-300 p-2 rounded-md relative overflow-hidden" :title="windowData.title">
            <img class="w-6 h-6" :src="windowData.icon" :alt="windowData.title" @click="() => {
        // @ts-ignore
        if (windowData.zIndex !== windows.length && !windowData.minimized) {
          // instead of minimizing, focus if not already focused
          windowData.update.toTop(windows)
          console.log(windowData.zIndex, windows.length)
        } else {
          windowData.titleButtons.minimize(windows)
        }
      }
        ">
            <span class="absolute bottom-0 left-0 w-full bg-emerald-400 h-1" v-if="!windowData.minimized"></span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>