import { ref } from "vue";

export default class WindowData {
  constructor(public title: string, public icon: string) {}

  public id = Math.random().toString(36).substring(2, 9);
  public zIndex = ref(1);

  public element = ref<HTMLElement | null>(null);
  public titleBar = ref<HTMLElement | null>(null);
  public updateElement = (element: HTMLElement) => {
    this.element.value = element;
  };
  public updateTitleBar = (element: HTMLElement) => {
    this.titleBar.value = element;
  };

  public size: { width: number; height: number } = {
    width: window.innerWidth / 4,
    height: window.innerHeight / 4,
  };

  private position: { x: number; y: number } = { x: 0, y: 0 };

  public getPosition() {
    return this.position;
  }

  public setPosition({ x, y }: { x?: number; y?: number }) {
    if (x !== undefined) {
      this.position.x = Math.min(
        Math.max(0, x),
        document.getElementById("windowSpace")!.offsetWidth -
          (this.element.value?.offsetWidth || this.size.width) // using offsetWidth until proper resizing is implemented
      );
    }
    if (y !== undefined) {
      this.position.y = Math.min(
        Math.max(0, y),
        document.getElementById("windowSpace")!.offsetHeight -
          (this.element.value?.offsetHeight || this.size.height) // using offsetHeight until proper resizing is implemented
      );
    }
  }

  public dragging: {
    startPosition: { x: number; y: number };
    clickPosition: { x: number; y: number };
  } | null = null;

  public dragListeners = {
    onMouseDown: (event: MouseEvent, windows: WindowData[]) => {
      // stop dragging listeners if maximized
      // TODO: change to unmaximize and change position to the mouse position
      if (event.button === 0 && !this.dragging && !this.maximized.value) {
        event.preventDefault();
        this.update.toTop(windows);
        this.dragging = {
          startPosition: { x: this.position.x, y: this.position.y },
          clickPosition: { x: event.clientX, y: event.clientY },
        };
        document.addEventListener("mousemove", this.dragListeners.onMouseMove);
        document.addEventListener("mouseup", this.dragListeners.onMouseUp);
      }
    },

    onDoubleClick: (event: MouseEvent) => {
      if (event.button === 0) {
        this.titleButtons.maximize();
      }
    },

    onMouseMove: (event: MouseEvent) => {
      // console.log(event);
      // make sure incase the listener is for some reason not removed
      if (this.dragging) {
        const clickPos = this.dragging.clickPosition;
        const startPos = this.dragging.startPosition;
        event.preventDefault();
        const newX = event.clientX - (clickPos.x - startPos.x);
        const newY = event.clientY - (clickPos.y - startPos.y);
        this.setPosition({ x: newX, y: newY });
        this.update.position();
      }
    },

    onMouseUp: (event: MouseEvent) => {
      // make sure incase the listener is for some reason not removed
      if (event.button === 0 && this.dragging) {
        event.preventDefault();
        this.dragging = null;
        document.removeEventListener(
          "mousemove",
          this.dragListeners.onMouseMove
        );
        document.removeEventListener("mouseup", this.dragListeners.onMouseUp);
      }
    },
  };

  public listeners = {
    onMouseDown: (event: MouseEvent, windows: WindowData[]) => {
      this.update.toTop(windows);
    },
  };

  public update = {
    size: () => {
      if (this.element && this.element.value) {
        this.element.value.style.width = `${this.size.width}px`;
        this.element.value.style.height = `${this.size.height}px`;
      }
    },

    position: () => {
      if (this.element.value) {
        this.element.value.style.left = `${this.position.x}px`;
        this.element.value.style.top = `${this.position.y}px`;
      }
    },

    zIndex: (value: number) => {
      this.zIndex.value = value;
      if (this.element.value) {
        this.element.value.style.zIndex = `${value}`;
      }
    },

    // move window to the top of the stack
    toTop: (windows: WindowData[]) => {
      // move all other windows down
      for (const window of windows) {
        if (window === this) {
          continue;
        }
        if (window.zIndex > this.zIndex.value) {
          // console.log(window);
          window.update.zIndex(window.zIndex - 1);
        } else {
          // console.log(window.zIndex, this.zIndex.value);
        }
      }
      // move the window to the top of the stack
      this.update.zIndex(windows.length);
    },
  };

  public maximized = ref(false);
  public minimized = ref(false);

  public titleButtons = {
    minimize: (windows: WindowData[]) => {
      console.log("Minimize");
      this.element.value?.classList.toggle("minimized");
      this.minimized.value = !this.minimized.value;
      if (this.minimized.value) {
        this.update.zIndex(0);
      } else {
        this.update.toTop(windows);
      }
    },
    maximize: () => {
      console.log("Maximize");
      this.element.value?.classList.toggle("maximized");
      this.maximized.value = !this.maximized.value;
    },
    close: () => {
      console.log("Close");
    },
  };

  public onMounted() {
    this.update.size();
    this.update.position();
    this.update.zIndex(1);
  }
}
