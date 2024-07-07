// src/__tests__/utilities.test.js
import { MathUtils, Vector, Collision, Time, DataStructure, Easing, Color, Geometry, Helpers, Assets, Debug, Cookie } from "../../utilities.js";

// Mock the global Image object
global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload && this.onload();
    });
  }
};

// Mock document and its cookie property
global.document = {
  cookie: "",
};

describe("Utilities", () => {
  describe("MathUtils", () => {
    describe("bezierBlend", () => {
      it("should return 0 when t is 0", () => {
        expect(MathUtils.bezierBlend(0)).toBe(0);
      });

      it("should return 1 when t is 1", () => {
        expect(MathUtils.bezierBlend(1)).toBe(1);
      });

      it("should return 0.5 when t is 0.5", () => {
        expect(MathUtils.bezierBlend(0.5)).toBeCloseTo(0.5, 5);
      });

      it("should return values between 0 and 1 for inputs between 0 and 1", () => {
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const result = MathUtils.bezierBlend(t);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(1);
        }
      });

      it("should be symmetric around t = 0.5", () => {
        for (let i = 0; i < 5; i++) {
          const t1 = i / 10;
          const t2 = 1 - t1;
          const result1 = MathUtils.bezierBlend(t1);
          const result2 = MathUtils.bezierBlend(t2);
          expect(result1).toBeCloseTo(1 - result2, 5);
        }
      });

      it("should handle negative inputs", () => {
        const result = MathUtils.bezierBlend(-1);
        expect(result).toBe(0);
      });

      it("should handle inputs greater than 1", () => {
        const result = MathUtils.bezierBlend(2);
        expect(result).toBe(1);
      });
    });

    // Add tests for other MathUtils functions here
    // For example:
    describe("lerp", () => {
      it("should correctly interpolate between two values", () => {
        expect(MathUtils.lerp(0, 10, 0.5)).toBe(5);
        expect(MathUtils.lerp(0, 10, 0)).toBe(0);
        expect(MathUtils.lerp(0, 10, 1)).toBe(10);
      });
    });

    describe("clamp", () => {
      it("should clamp values to the specified range", () => {
        expect(MathUtils.clamp(5, 0, 10)).toBe(5);
        expect(MathUtils.clamp(-5, 0, 10)).toBe(0);
        expect(MathUtils.clamp(15, 0, 10)).toBe(10);
      });
    });
  });

  describe("Vector", () => {
    test("add", () => {
      expect(Vector.add({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeDefined();
    });

    test("clamp", () => {
      expect(Vector.clamp({ x: 5, y: 5 }, 0, 10)).toBeDefined();
    });

    test("subtract", () => {
      expect(Vector.subtract({ x: 3, y: 3 }, { x: 1, y: 1 })).toBeDefined();
    });

    test("multiply", () => {
      expect(Vector.multiply({ x: 2, y: 2 }, 2)).toBeDefined();
    });

    test("divide", () => {
      expect(Vector.divide({ x: 4, y: 4 }, 2)).toBeDefined();
    });

    test("magnitude", () => {
      expect(Vector.magnitude({ x: 3, y: 4 })).toBeDefined();
    });

    test("normalize", () => {
      expect(Vector.normalize({ x: 3, y: 4 })).toBeDefined();
    });

    test("dotProduct", () => {
      expect(Vector.dotProduct({ x: 1, y: 2 }, { x: 3, y: 4 })).toBeDefined();
    });
  });
});

describe("Collision", () => {
  test("pointInRect", () => {
    expect(Collision.pointInRect({ x: 5, y: 5 }, { x: 0, y: 0, width: 10, height: 10 })).toBeDefined();
  });

  test("rectIntersect", () => {
    expect(Collision.rectIntersect({ x: 0, y: 0, width: 5, height: 5 }, { x: 3, y: 3, width: 5, height: 5 })).toBeDefined();
  });

  test("rectIntersectOverMargin", () => {
    expect(Collision.rectIntersectOverMargin({ x: 0, y: 0, width: 5, height: 5 }, { x: 3, y: 3, width: 5, height: 5 }, 1)).toBeDefined();
  });

  test("circleIntersect", () => {
    expect(Collision.circleIntersect({ x: 0, y: 0, radius: 5 }, { x: 7, y: 0, radius: 3 })).toBeDefined();
  });
});

describe("Time", () => {
  test("getTime", () => {
    expect(Time.getTime()).toBeDefined();
  });

  test("calculateDeltaTime", () => {
    expect(Time.calculateDeltaTime(performance.now())).toBeDefined();
  });
});

describe("DataStructure", () => {
  test("shuffleArray", () => {
    expect(DataStructure.shuffleArray([1, 2, 3, 4, 5])).toBeDefined();
  });

  test("deepClone", () => {
    expect(DataStructure.deepClone({ a: 1, b: { c: 2 } })).toBeDefined();
  });
});

describe("Easing", () => {
  test("easeInQuad", () => {
    expect(Easing.easeInQuad(0.5)).toBeDefined();
  });

  test("easeOutQuad", () => {
    expect(Easing.easeOutQuad(0.5)).toBeDefined();
  });

  test("easeInOutQuad", () => {
    expect(Easing.easeInOutQuad(0.5)).toBeDefined();
  });
});

describe("Color", () => {
  test("rgbToHex", () => {
    expect(Color.rgbToHex(255, 128, 0)).toBeDefined();
  });

  test("hexToRgb", () => {
    expect(Color.hexToRgb("#FF8000")).toBeDefined();
  });
});

describe("Geometry", () => {
  test("distance", () => {
    expect(Geometry.distance(0, 0, 3, 4)).toBeDefined();
  });

  test("angleBetweenPoints", () => {
    expect(Geometry.angleBetweenPoints(0, 0, 1, 1)).toBeDefined();
  });
});

describe("Helpers", () => {
  test("debounce", () => {
    expect(Helpers.debounce(() => {}, 100)).toBeDefined();
  });
});

describe("Assets", () => {
  test("loadImage", async () => {
    const imagePromise = Assets.loadImage("test.png");
    expect(imagePromise).toBeInstanceOf(Promise);
    const image = await imagePromise;
    expect(image).toBeDefined();
  });
});

describe("Debug", () => {
  test("log", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    Debug.log("Test message");
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("measurePerformance", () => {
    const measuredFunc = Debug.measurePerformance(() => {});
    expect(measuredFunc).toBeDefined();
  });
});

describe("Cookie", () => {
  beforeEach(() => {
    global.document.cookie = "";
  });

  test("bake", () => {
    const result = Cookie.bake("testCookie", "testValue", 1);
    expect(result).toContain("testCookie=");
    expect(result).toContain(encodeURIComponent(JSON.stringify("testValue")));
  });

  test("save", () => {
    Cookie.save("testCookie", "testValue");
    expect(global.document.cookie).toContain("testCookie=");
    expect(global.document.cookie).toContain(encodeURIComponent(JSON.stringify("testValue")));
  });

  test("get string value", () => {
    const testValue = "testValue";
    global.document.cookie = `testCookie=${encodeURIComponent(JSON.stringify(testValue))}`;
    const result = Cookie.get("testCookie");
    expect(result).toBe(testValue);
  });

  test("get object value", () => {
    const testValue = { key: "value" };
    global.document.cookie = `testCookie=${encodeURIComponent(JSON.stringify(testValue))}`;
    const result = Cookie.get("testCookie");
    expect(result).toEqual(testValue);
  });

  test("toss", () => {
    global.document.cookie = "testCookie=testValue";
    Cookie.toss("testCookie");
    expect(global.document.cookie).toContain("testCookie=;");
    expect(global.document.cookie).toContain("expires=Thu, 01 Jan 1970 00:00:00 UTC");
  });
});
