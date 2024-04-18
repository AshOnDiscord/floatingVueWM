<script setup lang="ts">
import { MinusIcon, Square2StackIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import { onMounted, ref } from "vue"

const props = defineProps<{
  icon: string
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const windowRef = ref<HTMLElement | null>(null);

const position = ref<{ x: number, y: number }>({ x: 10, y: 10 })
const setPosition = ({ x, y }: { x?: number, y?: number }) => {
  // make sure the window is not moved outside the screen
  if (x !== undefined) {
    position.value.x = Math.min(Math.max(0, x), window.innerWidth - size.value.width)
  }
  if (y !== undefined) {
    position.value.y = Math.min(Math.max(0, y), window.innerHeight - size.value.height)
  }
}
const updatePosition = () => {
  if (windowRef.value) {
    windowRef.value.style.left = `${position.value.x}px`
    windowRef.value.style.top = `${position.value.y}px`
  }
}

const size = ref<{ width: number, height: number }>({ width: window.innerWidth / 4, height: window.innerHeight / 4 })
const updateSize = () => {
  if (windowRef.value) {
    windowRef.value.style.width = `${size.value.width}px`
    windowRef.value.style.height = `${size.value.height}px`
  }
}

const beingDragged = ref(false)
const draggedPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })
const originalPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

const mousedown = (event: MouseEvent) => {
  if (event.button === 0) {
    event.preventDefault()
    beingDragged.value = true
    draggedPosition.value = { x: event.clientX, y: event.clientY }
    originalPosition.value = { x: position.value.x, y: position.value.y }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  }
}
const mouseup = (event: MouseEvent) => {
  if (event.button === 0) {
    event.preventDefault()
    beingDragged.value = false
    document.removeEventListener('mousemove', mousemove)
  }
}

const mousemove = (event: MouseEvent) => {
  if (beingDragged.value) {
    // do not use event.movement_ as they cause desync as they are relative not absolute positions
    // instead manually calculate based off the original mouse position on mousedown and the current mouse position
    // it'll also preserve the drag point when the position is being limited to the screen
    setPosition({
      x: event.clientX - (draggedPosition.value.x - originalPosition.value.x),
      y: event.clientY - (draggedPosition.value.y - originalPosition.value.y),
    })
    updatePosition()
  }
}

onMounted(() => {
  updateSize()
  updatePosition()
})

</script>

<template>
  <div class="window border-slate-200 border-2 shadow fixed" ref="windowRef">
    <nav class="flex justify-between bg-slate-200 px-2 py-1 text-slate-800" @mousedown="mousedown">
      <div class="flex gap-2">
        <img :src="props.icon" alt="" class="w-6 h-6">
        <span>{{ props.title }}</span>
      </div>
      <!-- Prevent bubbling -->
      <div class="text-slate-600" @click="(e) => e.preventDefault()">
        <button>
          <MinusIcon class="w-6 h-6" />
        </button>
        <button>
          <Square2StackIcon class="w-6 h-6" />
        </button>
        <button>
          <XMarkIcon class="w-6 h-6" @click="emit('close')" />
        </button>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>