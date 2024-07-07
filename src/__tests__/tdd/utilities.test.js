// src/__tests__/utilities.test.js
import { MathUtils, Vector, Collision, Time, DataStructure, Easing, Color, Geometry, Helpers, Assets, Debug, Cookie } from "../../utilities.js";

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
    // Add tests for Vector functions here
    describe("add", () => {
      it("should correctly add two vectors", () => {
        const v1 = { x: 1, y: 2 };
        const v2 = { x: 3, y: 4 };
        const result = Vector.add(v1, v2);
        expect(result).toEqual({ x: 4, y: 6 });
      });
    });

    // Add more Vector tests...
  });

  // Add test suites for other utility objects (Collision, Time, DataStructure, etc.)
  // For example:
  describe("Collision", () => {
    describe("pointInRect", () => {
      it("should correctly detect if a point is inside a rectangle", () => {
        const point = { x: 5, y: 5 };
        const rect = { x: 0, y: 0, width: 10, height: 10 };
        expect(Collision.pointInRect(point, rect)).toBe(true);
      });

      it("should correctly detect if a point is outside a rectangle", () => {
        const point = { x: 15, y: 15 };
        const rect = { x: 0, y: 0, width: 10, height: 10 };
        expect(Collision.pointInRect(point, rect)).toBe(false);
      });
    });

    // Add more Collision tests...
  });

  // Continue adding test suites for Time, DataStructure, Easing, Color, Geometry, Helpers, Assets, Debug, and Cookie
});
