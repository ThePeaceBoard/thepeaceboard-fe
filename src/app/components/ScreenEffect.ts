// app/components/ScreenEffect.ts

import styles from './ScreenEffect.module.scss';

/** Returns an integer in [min, max], inclusive. */
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface EffectData {
  wrapper: HTMLElement;
  node?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement | HTMLDivElement;
  ctx?: CanvasRenderingContext2D;
  enabled: boolean;
  config: Record<string, any>;
  original?: HTMLElement;
}

class ScreenEffect {
  private parent: HTMLElement;
  private config: Record<string, any>;
  public effects: Record<string, EffectData>;
  private events: { resize: (e?: UIEvent) => void };
  private nodes!: {
    container: HTMLDivElement;
    wrapper1: HTMLDivElement;
    wrapper2: HTMLDivElement;
    wrapper3: HTMLDivElement;
  };
  private rect!: DOMRect;
  private vcrInterval?: number;
  private snowframe?: number;

  constructor(parent: string | HTMLElement, options?: Record<string, any>) {
    if (typeof parent === "string") {
      const el = document.querySelector(parent);
      if (!el) throw new Error(`ScreenEffect: no element matches "${parent}"`);
      this.parent = el as HTMLElement;
    } else {
      this.parent = parent;
    }

    this.config = Object.assign({}, options);
    this.effects = {};

    this.events = {
      resize: this.onResize.bind(this),
    };

    // Initialize rect with default values to prevent errors
    this.rect = this.parent.getBoundingClientRect();
    
    // If dimensions are invalid, set safe defaults
    if (!this.rect || this.rect.width <= 0 || this.rect.height <= 0) {
      this.rect = {
        x: 0, y: 0, 
        width: 640, height: 480,
        top: 0, left: 0, right: 640, bottom: 480,
        toJSON: () => ({})
      };
    }

    window.addEventListener("resize", this.events.resize, false);
    this.render();
  }

  private render(): void {
    const container = document.createElement("div");
    container.classList.add(styles.screenContainer);

    const wrapper1 = document.createElement("div");
    wrapper1.classList.add(styles.screenWrapper);

    const wrapper2 = document.createElement("div");
    wrapper2.classList.add(styles.screenWrapper);

    const wrapper3 = document.createElement("div");
    wrapper3.classList.add(styles.screenWrapper);

    wrapper1.appendChild(wrapper2);
    wrapper2.appendChild(wrapper3);

    container.appendChild(wrapper1);

    // Insert the container before the parent, then move parent inside wrapper3
    this.parent.parentNode?.insertBefore(container, this.parent);
    wrapper3.appendChild(this.parent);

    this.nodes = { container, wrapper1, wrapper2, wrapper3 };
    this.onResize();
  }

  private onResize(e?: UIEvent): void {
    const newRect = this.parent.getBoundingClientRect();
    
    // Only update if we have valid dimensions
    if (newRect && newRect.width > 0 && newRect.height > 0) {
      this.rect = newRect;
    }
    
    if (this.effects.vcr && this.effects.vcr.enabled) {
      this.generateVCRNoise();
    }
  }

  public add(type: string | string[], options?: Record<string, any>): this {
    const config = Object.assign({ fps: 30, blur: 1 }, options);
    // If user passes array of effect types
    if (Array.isArray(type)) {
      for (const t of type) this.add(t, config);
      return this;
    }

    if (type === "snow") {
      this.addSnow(config);
      return this;
    }
    if (type === "roll") {
      this.enableRoll();
      return this;
    }
    if (type === "vcr") {
      this.addVCR(config);
      return this;
    }

    let node: HTMLElement | null = null;
    let wrapper = this.nodes.wrapper2;

    switch (type) {
      case "wobblex":
      case "wobbley":
        this.parent.classList.add(styles[type]);
        break;

      case "scanlines":
        node = document.createElement("div");
        node.classList.add(styles.scanlines);
        this.nodes.container.appendChild(node);
        wrapper = this.nodes.container;
        break;

      case "vignette":
        node = document.createElement("div");
        node.classList.add(styles.vignette);
        this.nodes.container.appendChild(node);
        wrapper = this.nodes.container;
        break;

      case "image":
        wrapper = this.nodes.wrapper2;
        const imgNode = document.createElement("img");
        imgNode.classList.add(type);
        imgNode.src = config.src;
        wrapper.appendChild(imgNode);
        node = imgNode;
        break;

      case "video":
        wrapper = this.nodes.wrapper2;
        const videoNode = document.createElement("video");
        videoNode.classList.add(type);
        videoNode.src = config.src;
        videoNode.crossOrigin = "anonymous";
        videoNode.autoplay = true;
        videoNode.muted = true;
        videoNode.loop = true;
        wrapper.appendChild(videoNode);
        node = videoNode;
        break;
    }

    this.effects[type] = {
      wrapper,
      node: node as HTMLDivElement | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | undefined,
      enabled: true,
      config,
    };
    return this;
  }

  public remove(type: string): this {
    const obj = this.effects[type];
    if (obj && obj.enabled) {
      obj.enabled = false;

      if (type === "roll" && obj.original) {
        this.parent.appendChild(obj.original);
      }
      if (type === "vcr") {
        clearInterval(this.vcrInterval);
      }
      if (type === "snow" && this.snowframe !== undefined) {
        cancelAnimationFrame(this.snowframe);
      }

      if (obj.node) {
        obj.wrapper.removeChild(obj.node);
      } else {
        // For wobble effects, remove from parent element
        if (type === "wobblex" || type === "wobbley") {
          this.parent.classList.remove(styles[type]);
        } else {
          obj.wrapper.classList.remove(type);
        }
      }
    }
    return this;
  }

  private enableRoll(): void {
    const el = this.parent.firstElementChild as HTMLElement | null;
    if (el) {
      const div = document.createElement("div");
      div.classList.add("roller");

      this.parent.appendChild(div);
      div.appendChild(el);
      div.appendChild(el.cloneNode(true));

      this.effects.roll = {
        enabled: true,
        wrapper: this.parent,
        node: div,
        original: el,
        config: {},
      };
    }
  }

  private addSnow(config: Record<string, any>): void {
    const canvas = document.createElement("canvas");
    canvas.classList.add(styles.snow);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use viewport dimensions instead of rect
    const width = Math.max(1, window.innerWidth / 2);
    const height = Math.max(1, window.innerHeight / 2);
    
    canvas.width = width;
    canvas.height = height;

    // Change from wrapper2 to container for consistent layering
    this.nodes.container.appendChild(canvas);

    const animate = () => {
      this.generateSnow(ctx);
      this.snowframe = requestAnimationFrame(animate);
    };
    animate();

    this.effects.snow = {
      wrapper: this.nodes.container, // Update wrapper reference
      node: canvas,
      enabled: true,
      config,
    };
  }

  private addVCR(config: Record<string, any>): void {
    const canvas = document.createElement("canvas");
    canvas.classList.add(styles.vcr);
    
    // Use container instead of wrapper2
    this.nodes.container.appendChild(canvas);

    // Use viewport dimensions instead of rect
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    this.effects.vcr = {
      wrapper: this.nodes.container,
      node: canvas,
      ctx,
      enabled: true,
      config,
    };
    this.generateVCRNoise();
  }

  private generateVCRNoise(): void {
    const obj = this.effects.vcr;
    if (!obj || !obj.node || !obj.ctx) return;
    const config = obj.config;

    clearInterval(this.vcrInterval);
    if (this.vcrInterval !== undefined) {
      cancelAnimationFrame(this.vcrInterval);
    }

    if (config.fps >= 60) {
      const animate = () => {
        this.renderTrackingNoise();
        this.vcrInterval = requestAnimationFrame(animate) as unknown as number;
      };
      animate();
    } else {
      this.vcrInterval = window.setInterval(() => {
        this.renderTrackingNoise();
      }, 1000 / config.fps);
    }
  }

  private generateSnow(ctx: CanvasRenderingContext2D): void {
    const w = ctx.canvas.width || 1;  // Ensure minimum of 1
    const h = ctx.canvas.height || 1; // Ensure minimum of 1
    
    // Safety check to prevent errors
    if (w <= 0 || h <= 0 || !isFinite(w) || !isFinite(h)) {
      
      return;
    }
    
    try {
      const d = ctx.createImageData(w, h);
      const b = new Uint32Array(d.data.buffer);
      const len = b.length;

      for (let i = 0; i < len; i++) {
        b[i] = ((255 * Math.random()) | 0) << 24;
      }
      ctx.putImageData(d, 0, 0);
    } catch (error) {
      
    }
  }

  private renderTrackingNoise(radius = 2, xmax?: number, ymax?: number): void {
    const obj = this.effects.vcr;
    if (!obj || !obj.enabled || !obj.node || !obj.ctx) return;

    const canvas = obj.node as HTMLCanvasElement;
    const ctx = obj.ctx;
    const config = obj.config;

    // Ensure canvas has valid dimensions
    if (canvas.width <= 0 || canvas.height <= 0) {
      
      return;
    }

    let posy1 = config.miny || 0;
    let posy2 = config.maxy || canvas.height;
    let posy3 = config.miny2 || 0;
    const num = config.num || 20;

    const canvasWidth = canvas.width || 1;
    const canvasHeight = canvas.height || 1;
    
    if (xmax === undefined) xmax = canvasWidth;
    if (ymax === undefined) ymax = canvasHeight;

    try {
      canvas.style.filter = `blur(${config.blur}px)`;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#fff";
      ctx.beginPath();

      for (let i = 0; i <= num; i++) {
        const x = Math.random() * (xmax || 1);
        const y1 = getRandomInt((posy1 += 3), posy2);
        const y2 = getRandomInt(0, (posy3 -= 3));
        ctx.fillRect(x, y1, radius, radius);
        ctx.fillRect(x, y2, radius, radius);
        ctx.fill();

        this.renderTail(ctx, x, y1, radius);
        this.renderTail(ctx, x, y2, radius);
      }
      ctx.closePath();
    } catch (error) {
      
    }
  }

  private renderTail(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
    const n = getRandomInt(1, 50);
    const dirs = [1, -1];
    let rd = radius;
    const dir = dirs[Math.floor(Math.random() * dirs.length)];

    for (let i = 0; i < n; i++) {
      const step = 0.01;
      const r = getRandomInt((rd -= step), radius);
      let dx = getRandomInt(1, 4);

      radius -= 0.1;
      dx *= dir;

      x += dx;
      ctx.fillRect(x, y, r, r);
      ctx.fill();
    }
  }
}

export { ScreenEffect, getRandomInt };
