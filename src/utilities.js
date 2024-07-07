// js/utilities.js

// MathUtils Functions
const MathUtils = {
  bezierBlend: (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t * t * (3.0 - 2.0 * t);
  },

  lerp: (start, end, t) => start * (1 - t) + end * t,

  clamp: (value, min, max) => Math.min(Math.max(value, min), max),

  randomRange: (min, max) => Math.random() * (max - min) + min,

  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
};

// Vector Operations
const Vector = {
  add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),

  clamp: (v, min, max) => ({
    x: MathUtils.clamp(v.x, min, max),
    y: MathUtils.clamp(v.y, min, max),
  }),

  subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),

  multiply: (v, scalar) => ({ x: v.x * scalar, y: v.y * scalar }),

  divide: (v, scalar) => (scalar !== 0 ? { x: v.x / scalar, y: v.y / scalar } : { x: 0, y: 0 }),

  magnitude: (v) => Math.sqrt(v.x * v.x + v.y * v.y),

  normalize: (v) => {
    const mag = Vector.magnitude(v);
    return mag > 0 ? Vector.divide(v, mag) : { x: 0, y: 0 };
  },

  dotProduct: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
};

// Collision Detection
const Collision = {
  pointInRect: (point, rect) => point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height,

  rectIntersect: (rect1, rect2) => rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y,

  rectIntersectOverMargin: (rect1, rect2, margin) => {
    const adjustedRect1 = {
      x: rect1.x + margin,
      y: rect1.y + margin,
      width: rect1.width - 2 * margin,
      height: rect1.height - 2 * margin,
    };

    const adjustedRect2 = {
      x: rect2.x + margin,
      y: rect2.y + margin,
      width: rect2.width - 2 * margin,
      height: rect2.height - 2 * margin,
    };

    return (
      adjustedRect1.x < adjustedRect2.x + adjustedRect2.width &&
      adjustedRect1.x + adjustedRect1.width > adjustedRect2.x &&
      adjustedRect1.y < adjustedRect2.y + adjustedRect2.height &&
      adjustedRect1.y + adjustedRect1.height > adjustedRect2.y
    );
  },

  circleIntersect: (circle1, circle2) => {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
  },
};

// Time Functions
const Time = {
  getTime: () => performance.now(),

  calculateDeltaTime: (lastTime) => {
    const currentTime = Time.getTime();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    return { deltaTime, currentTime };
  },
};

// Data Structure Operations
const DataStructure = {
  shuffleArray: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
};

// Easing Functions
const Easing = {
  easeInQuad: (t) => t * t,

  easeOutQuad: (t) => t * (2 - t),

  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

// Color Manipulation
const Color = {
  rgbToHex: (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),

  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
};

// Geometry
const Geometry = {
  distance: (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  angleBetweenPoints: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
};

// Helper Functions
const Helpers = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// Asset Loading
const Assets = {
  loadImage: (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    }),
};

// Logging and Debugging
const Debug = {
  log: (message, category = "INFO") => {
    console.log(`[${category}] ${new Date().toISOString()}: ${message}`);
  },

  measurePerformance: (func) => {
    return function (...args) {
      const start = performance.now();
      const result = func.apply(this, args);
      const end = performance.now();
      console.log(`${func.name} took ${end - start} milliseconds.`);
      return result;
    };
  },
};

const Cookie = {
  MAX_COOKIE_SIZE: 4096, // bytes

  bake: (name, value, days) => {
    if (value === undefined || value === null) {
      throw new Error("Cookie value cannot be undefined or null");
    }

    let cookieString;
    try {
      const stringifiedValue = JSON.stringify(value);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (days || 0));
      cookieString = `${name}=${encodeURIComponent(stringifiedValue)}; expires=${expirationDate.toUTCString()}; path=/`;
    } catch (error) {
      throw new Error(`Failed to stringify cookie value: ${error.message}`);
    }

    const size = new TextEncoder().encode(cookieString).length;
    if (size > Cookie.MAX_COOKIE_SIZE) {
      throw new Error(`Cookie size (${size} bytes) exceeds maximum allowed size (${Cookie.MAX_COOKIE_SIZE} bytes)`);
    }

    return cookieString;
  },

  save: (name, value, days = 400) => {
    try {
      const cookieString = Cookie.bake(name, value, days);
      document.cookie = cookieString;
    } catch (error) {
      console.error(`Failed to save cookie: ${error.message}`);
    }
  },

  get: (name) => {
    const nameEQ = `${name}=`;
    const cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const rawValue = decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          // If parsing fails, return the raw string
          return rawValue;
        }
      }
    }
    return null;
  },

  toss: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export { MathUtils, Vector, Collision, Time, DataStructure, Easing, Color, Geometry, Helpers, Assets, Debug, Cookie };
