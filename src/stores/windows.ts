import { defineStore } from "pinia";
import { ref } from "vue";
import Window from "../types/window";

export const useWindowsStore = defineStore("windows", () => {
  const windows = ref<Window[]>([]);
  const addWindow = (window: Window) => {
    windows.value.push(window);
  };
  const removeWindow = (window: Window) => {
    const index = windows.value.indexOf(window);
    if (index !== -1) {
      windows.value.splice(index, 1);
    }
  };
  return {
    windows,
    addWindow,
    removeWindow,
  };
});
