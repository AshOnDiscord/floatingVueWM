<script setup lang="ts">
import WindowComponent from './components/WindowComponent.vue';
import Desktop from './components/Desktop.vue';

import { ref, shallowRef, h } from 'vue';

interface Window {
  window: object, // WindowComponent
  children: object, // any component
  props: {
    id: string,
    title: string,
    icon: string,
  }
}

const createWindow = (title: string, icon: string, children: object) => {
  return {
    window: WindowComponent,
    children,
    props: {
      id: Math.random().toString(36).substring(7),
      title,
      icon,
    }
  }
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In metus vulputate eu scelerisque. Egestas diam in arcu cursus. Egestas integer eget aliquet nibh praesent tristique magna. Mattis rhoncus urna neque viverra justo. Tortor condimentum lacinia quis vel eros. Nec nam aliquam sem et tortor consequat id. Eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Quam pellentesque nec nam aliquam sem et tortor consequat id. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Elementum nisi quis eleifend quam. In metus vulputate eu scelerisque. Nulla facilisi cras fermentum odio eu. Accumsan sit amet nulla facilisi morbi tempus iaculis. Et tortor at risus viverra adipiscing at.

Nec sagittis aliquam malesuada bibendum arcu. Nibh praesent tristique magna sit amet. Laoreet sit amet cursus sit amet. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Nunc consequat interdum varius sit amet mattis vulputate enim nulla. Felis donec et odio pellentesque. Ullamcorper velit sed ullamcorper morbi tincidunt ornare. Non sodales neque sodales ut. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Sed blandit libero volutpat sed cras ornare arcu. Neque viverra justo nec ultrices dui sapien. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Scelerisque fermentum dui faucibus in ornare.

Proin fermentum leo vel orci. Eget velit aliquet sagittis id consectetur. Ultrices tincidunt arcu non sodales. Nullam ac tortor vitae purus faucibus ornare suspendisse sed. Dictum sit amet justo donec enim diam vulputate ut. Aliquet enim tortor at auctor urna nunc id cursus metus. Quis vel eros donec ac odio tempor. Et netus et malesuada fames ac turpis egestas sed tempus. Quis varius quam quisque id diam vel quam elementum pulvinar. Auctor augue mauris augue neque gravida in fermentum. Vitae sapien pellentesque habitant morbi tristique senectus et. Tempus egestas sed sed risus pretium quam vulputate dignissim. Diam sollicitudin tempor id eu nisl nunc mi ipsum. Vel pharetra vel turpis nunc eget lorem dolor sed. Vitae ultricies leo integer malesuada nunc. Velit ut tortor pretium viverra. Odio eu feugiat pretium nibh ipsum. Tortor pretium viverra suspendisse potenti nullam ac. In nibh mauris cursus mattis molestie a iaculis at erat.

Sit amet aliquam id diam maecenas. Ante metus dictum at tempor commodo. Non diam phasellus vestibulum lorem sed risus ultricies tristique nulla. Volutpat sed cras ornare arcu dui vivamus. Integer feugiat scelerisque varius morbi enim nunc faucibus. Placerat vestibulum lectus mauris ultrices eros in cursus. Commodo odio aenean sed adipiscing diam donec adipiscing tristique risus. Nulla facilisi etiam dignissim diam quis. A iaculis at erat pellentesque adipiscing commodo. Felis bibendum ut tristique et egestas quis. Malesuada nunc vel risus commodo. Gravida in fermentum et sollicitudin ac orci phasellus. Enim diam vulputate ut pharetra sit amet aliquam id diam. Pellentesque elit eget gravida cum.

Odio tempor orci dapibus ultrices. Lorem donec massa sapien faucibus et molestie ac feugiat. Lacus sed turpis tincidunt id aliquet. Amet nisl purus in mollis nunc sed id. Ut sem nulla pharetra diam sit amet. Enim ut tellus elementum sagittis vitae. Sapien et ligula ullamcorper malesuada proin libero nunc consequat. Nec ultrices dui sapien eget mi proin sed libero enim. Lacus sed turpis tincidunt id aliquet risus feugiat in. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Cras semper auctor neque vitae tempus quam pellentesque. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Orci ac auctor augue mauris augue. Non consectetur a erat nam at lectus urna. Placerat vestibulum lectus mauris ultrices eros. Cursus sit amet dictum sit amet. Sed vulputate mi sit amet mauris commodo quis imperdiet. Vitae et leo duis ut diam quam nulla porttitor massa.`

const windows = shallowRef<Window[]>([
  createWindow('Lorem Ipsum', '/dist/vite.svg', () => h("p", lorem)),
])

console.log(windows.value)
console.log(windows.value[0])

const wallpaper = ref("https://cdn.wallpaperhub.app/cloudcache/2/b/c/3/7/5/2bc375a59ea8bb65dbd995b77ab56cbc3107a651.jpg");
</script>

<template>
  <div class="w-screen h-screen grid grid-rows-[1fr,min-content]">
    <div id="workspace" class="bg-cover bg-center w-screen relative" :style="{ backgroundImage: `url(${wallpaper})` }">
      <Desktop />
      <div id="windows">
        <WindowComponent v-for="window in windows" :key="window.props.id" :props="window.props"
          :children="window.children" />
      </div>
    </div>
    <nav id="taskbar" class="px-3 py-2">
      <ul class="flex gap-2">
        <li v-for="window in windows" :key="window.props.id">
          <button class="p-2 rounded-md hover:bg-slate-200">
            <img :src="window.props.icon" class="h-6 w-6" />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>