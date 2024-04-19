<script setup lang="ts">
const { props, children } = defineProps<{
  props: {
    id: string
    title: string
    icon: string
  }
  children: any
}>();

</script>

<template>
  <div class="absolute bg-white grid grid-rows-[min-content,auto] w-[50vw] h-[50vh] rounded-lg overflow-hidden">
    <nav class="flex justify-between bg-slate-200 px-2 py-1">
      <div class="flex gap-2">
        <img :src="props.icon" class="h-6 w-6" />
        <span>{{ props.title }}</span>
      </div>
      <ul class="grid grid-cols-3">
        <li class="flex justify-center items-center"><button>-</button></li>
        <li class="flex justify-center items-center"><button>O</button></li>
        <li class="flex justify-center items-center"><button>X</button></li>
      </ul>
    </nav>
    <main class="overflow-hidden pl-2 pr-1 py-1 ">
      <div class="overflow-scroll h-full pr-1">
        <component :is="children" />
      </div>
    </main>
  </div>
</template>;
