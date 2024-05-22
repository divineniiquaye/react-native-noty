import { Dimensions, StatusBar, UIManager } from "react-native";

export const TOP_OFFSET = 15;
export const ARROW_WIDTH = 20;
export const ARROW_HEIGHT = 15;
export const RENDER_BOUNDARY = 6;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type Coordinates = {
  width: number;
  height: number;
  px: number;
  py: number;
  centerPoint: {
    x: number;
    y: number;
  };
};

export async function getCoordinates(target: number): Promise<Coordinates> {
  const coordinates = new Promise((resolve) => {
    function measure() {
      UIManager.measure(target, (x, _y, width, height, px, py) => {
        py = py + (StatusBar?.currentHeight ?? 0);

        if (isNaN(x)) {
          setTimeout(measure, 100);
        } else {
          const coords = {
            width,
            height,
            px,
            py,
            centerPoint: {
              y: py + height / 2,
              x: px + width / 2,
            },
          };
          resolve(coords);

        }
      });
    }
    measure();
  });

  return coordinates as Promise<Coordinates>;
}

export function getPosition(
  coords: Coordinates,
  height: number,
  width: number,
) {
  const { height: elementHeight = 0, py = 0, centerPoint } = coords;

  let position = {
    top: py + elementHeight + TOP_OFFSET,
    left: centerPoint.x - width / 2,
  };

  // Ensure the tooltip stays within the screen bounds
  // Left boundary check
  if (position.left < RENDER_BOUNDARY) position.left = RENDER_BOUNDARY * 2;

  // Right boundary check
  const tipRightX = position.left + width;
  if (tipRightX + RENDER_BOUNDARY > screenWidth) {
    position.left = screenWidth - width - (RENDER_BOUNDARY * 2);
  }

  // Bottom boundary check: if tooltip extrapolates screen on bottom side, invert it
  const tipBottomY = position.top + height;
  const shouldInvertTip = tipBottomY + RENDER_BOUNDARY > screenHeight;

  if (shouldInvertTip) {
    position.top = py - height - TOP_OFFSET;
  }

  return {
    coordinates: coords,
    shouldInvertTip,
    position,
  } as const;
}
