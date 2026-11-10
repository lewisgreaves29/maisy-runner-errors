/**
 * Pennine & Peak District Obstacles & Landscape Elements
 *
 * Obstacles:
 * 1. Dry Stone Wall: Irregular, textured layered stone (short & wide)
 * 2. Post-and-Rail Fence: Rustic weathered timber fencing (taller & narrow)
 * 3. Mud Puddle / Moorland Bracken: Low profile ground hazard
 *
 * Landscape:
 * Parallax undulating Pennine moorland hills in 15% Sage Green
 */

export interface ObstacleTypeDefinition {
  type: 'STONE_WALL' | 'WOODEN_FENCE' | 'MUD_PUDDLE';
  width: number;
  height: number;
  hitboxInset: { x: number; y: number };
}

export const OBSTACLE_TYPES: Record<string, ObstacleTypeDefinition> = {
  STONE_WALL: {
    type: 'STONE_WALL',
    width: 42,
    height: 28,
    hitboxInset: { x: 5, y: 5 },
  },
  WOODEN_FENCE: {
    type: 'WOODEN_FENCE',
    width: 24,
    height: 36,
    hitboxInset: { x: 5, y: 5 },
  },
  MUD_PUDDLE: {
    type: 'MUD_PUDDLE',
    width: 32,
    height: 12,
    hitboxInset: { x: 4, y: 3 },
  },
};

export const LANDSCAPE_COLORS = {
  sageGreen: '#4A614E',
  sageGreen15: 'rgba(74, 97, 78, 0.15)',
  sageGreen25: 'rgba(74, 97, 78, 0.25)',
  stoneBase: '#5c665e',
  stoneDark: '#3e4740',
  stoneLight: '#78857a',
  stoneCap: '#4a534b',
  woodDark: '#4e3d30',
  woodMid: '#7a6552',
  woodGrain: '#382a20',
  mudDark: '#3d3023',
  mudMid: '#594532',
  brackenGreen: '#5b6e4b',
};

/**
 * Draw Dry Stone Wall on Canvas
 */
export function drawStoneWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width = 48,
  height = 32,
): void {
  ctx.save();
  ctx.translate(x, y);

  // Wall base shadow
  ctx.fillStyle = LANDSCAPE_COLORS.stoneDark;
  ctx.fillRect(0, 0, width, height);

  // Layered course stone pattern (Gritstone dry-stone masonry)
  const courses = [
    { y: 0, h: 7, blocks: [12, 14, 11, 11] },
    { y: 7, h: 8, blocks: [16, 12, 20] },
    { y: 15, h: 8, blocks: [10, 18, 20] },
    { y: 23, h: 9, blocks: [14, 15, 19] },
  ];

  courses.forEach((course, cIdx) => {
    let curX = 0;
    course.blocks.forEach((bWidth, bIdx) => {
      // Alternate shades for natural stone texture
      ctx.fillStyle =
        (cIdx + bIdx) % 2 === 0 ? LANDSCAPE_COLORS.stoneBase : LANDSCAPE_COLORS.stoneLight;
      ctx.fillRect(curX + 1, course.y + 1, bWidth - 2, course.h - 2);

      // Shadow underside of each stone
      ctx.fillStyle = LANDSCAPE_COLORS.stoneDark;
      ctx.fillRect(curX + 1, course.y + course.h - 2, bWidth - 2, 1);

      curX += bWidth;
    });
  });

  // Top capping stones (Pennine rounded / angled top copers)
  ctx.fillStyle = LANDSCAPE_COLORS.stoneCap;
  for (let cX = 0; cX < width; cX += 8) {
    ctx.beginPath();
    ctx.arc(cX + 4, 3, 3, Math.PI, 0);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Post-and-Rail Timber Fence on Canvas
 */
export function drawWoodenFence(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width = 28,
  height = 44,
): void {
  ctx.save();
  ctx.translate(x, y);

  // 2 vertical posts
  const postWidth = 6;
  const posts = [2, width - postWidth - 2];

  posts.forEach((pX) => {
    // Weathered timber post
    ctx.fillStyle = LANDSCAPE_COLORS.woodDark;
    ctx.fillRect(pX, 0, postWidth, height);
    ctx.fillStyle = LANDSCAPE_COLORS.woodMid;
    ctx.fillRect(pX + 1, 0, postWidth - 2, height);

    // Angled post top (rustic cut)
    ctx.beginPath();
    ctx.moveTo(pX, 3);
    ctx.lineTo(pX + postWidth / 2, 0);
    ctx.lineTo(pX + postWidth, 3);
    ctx.closePath();
    ctx.fillStyle = LANDSCAPE_COLORS.woodGrain;
    ctx.fill();
  });

  // 2 horizontal rails across posts
  const rails = [
    { y: 12, h: 6 },
    { y: 28, h: 6 },
  ];

  rails.forEach((rail) => {
    ctx.fillStyle = LANDSCAPE_COLORS.woodMid;
    ctx.fillRect(0, rail.y, width, rail.h);
    // Rail shadow & grain line
    ctx.fillStyle = LANDSCAPE_COLORS.woodGrain;
    ctx.fillRect(0, rail.y + rail.h - 1.5, width, 1.5);
  });

  ctx.restore();
}

/**
 * Draw Mud Puddle / Moorland Bracken
 */
export function drawMudPuddle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width = 38,
  height = 14,
): void {
  ctx.save();
  ctx.translate(x, y);

  // Peat puddle ellipse
  ctx.fillStyle = LANDSCAPE_COLORS.mudDark;
  ctx.beginPath();
  ctx.ellipse(width / 2, height - 4, width / 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = LANDSCAPE_COLORS.mudMid;
  ctx.beginPath();
  ctx.ellipse(width / 2, height - 4, width / 2 - 3, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Low bracken fronds sticking up
  ctx.fillStyle = LANDSCAPE_COLORS.brackenGreen;
  ctx.beginPath();
  ctx.moveTo(6, height - 3);
  ctx.lineTo(9, 2);
  ctx.lineTo(12, height - 3);
  ctx.moveTo(22, height - 3);
  ctx.lineTo(26, 4);
  ctx.lineTo(29, height - 3);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw Parallax Moorland Hills
 */
export function drawMoorlandHorizon(
  ctx: CanvasRenderingContext2D,
  scrollOffset: number,
  canvasWidth: number,
  horizonY = 175,
): void {
  ctx.save();

  // Distant subtle Pennine hills (15% opacity Sage Green)
  ctx.fillStyle = LANDSCAPE_COLORS.sageGreen15;
  ctx.beginPath();
  ctx.moveTo(0, horizonY + 25);

  const wavelength = 360;
  const hillHeight = 35;
  const offset = (scrollOffset * 0.1) % wavelength;

  for (let x = -offset; x <= canvasWidth + wavelength; x += 40) {
    const angle = ((x + offset) / wavelength) * Math.PI * 2;
    const y = horizonY - Math.sin(angle) * hillHeight - Math.cos(angle * 0.5) * (hillHeight * 0.4);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvasWidth, horizonY + 40);
  ctx.lineTo(0, horizonY + 40);
  ctx.closePath();
  ctx.fill();

  // Midground hill crest (slight variation)
  ctx.fillStyle = LANDSCAPE_COLORS.sageGreen25;
  ctx.beginPath();
  const midWavelength = 240;
  const midOffset = (scrollOffset * 0.25) % midWavelength;
  ctx.moveTo(0, horizonY + 30);

  for (let x = -midOffset; x <= canvasWidth + midWavelength; x += 30) {
    const angle = ((x + midOffset) / midWavelength) * Math.PI * 2;
    const y = horizonY + 8 - Math.sin(angle + 1.2) * 16;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvasWidth, horizonY + 40);
  ctx.lineTo(0, horizonY + 40);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
