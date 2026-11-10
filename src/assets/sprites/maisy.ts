/**
 * Maisy the Working Cocker Spaniel - Vector Sprite Definitions & Path Data
 *
 * Breed: Working Cocker Spaniel
 * Visual traits: Solid glossy black coat, feathered ears lifting with motion,
 * energetic tail, and a distinct pure-white vertical flash mark centered on her chest.
 */

export interface SpriteFrame {
  width: number;
  height: number;
  svg: string;
}

export const MAISY_COLORS = {
  coatDark: '#161917',
  coatMid: '#242a25',
  coatHighlight: '#38423a',
  chestFlash: '#FFFFFF',
  tongue: '#d47c59',
  eye: '#FAF7F2',
  pupil: '#0d0f0e',
  nose: '#0d0f0e',
};

// SVG strings for all poses
export const MAISY_SPRITES: Record<string, SpriteFrame> = {
  // Running Cycle: Frame 0 (Stride reach - front legs forward, rear legs trailing)
  run0: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Body & Hindquarters -->
      <ellipse cx="28" cy="22" rx="14" ry="9" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Rear legs -->
      <path d="M18 25 L12 36 L15 37 L21 27 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M22 25 L18 38 L22 38 L25 26 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Front legs -->
      <path d="M35 25 L42 36 L45 35 L38 24 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M32 25 L38 38 L41 38 L35 25 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Chest & White Flash -->
      <path d="M34 16 Q39 20 37 27 Q33 28 31 22 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M35 18 C37 20 37 24 35 26 C34 25 34 21 35 18 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head & Snout -->
      <circle cx="43" cy="15" r="7" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="48" cy="17" rx="5" ry="3.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="52" cy="15" r="1.5" fill="${MAISY_COLORS.nose}"/>
      <circle cx="44" cy="13" r="1.2" fill="${MAISY_COLORS.eye}"/>
      <circle cx="44.3" cy="13" r="0.6" fill="${MAISY_COLORS.pupil}"/>
      <!-- Feathered Spaniel Ear (Floating mid-stride) -->
      <path d="M40 12 C35 11 31 16 33 23 C35 25 38 23 39 17 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M33 20 C31 22 33 25 36 24" stroke="${MAISY_COLORS.coatHighlight}" stroke-width="0.8" fill="none"/>
      <!-- Tail (Wagging high) -->
      <path d="M15 20 Q9 15 11 10 Q13 10 17 18 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Running Cycle: Frame 1 (Stride gather - legs transitioning beneath body)
  run1: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="21" rx="14" ry="9" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Rear legs tucked forward -->
      <path d="M19 25 L17 37 L20 37 L23 26 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M23 25 L22 36 L25 36 L27 25 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Front legs trailing slightly -->
      <path d="M33 25 L32 37 L35 37 L37 26 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M31 25 L29 36 L32 36 L34 25 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Chest & White Flash -->
      <path d="M34 16 Q39 20 37 27 Q33 28 31 22 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M35 18 C37 20 37 24 35 26 C34 25 34 21 35 18 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head & Snout -->
      <circle cx="43" cy="14" r="7" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="48" cy="16" rx="5" ry="3.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="52" cy="14" r="1.5" fill="${MAISY_COLORS.nose}"/>
      <circle cx="44" cy="12" r="1.2" fill="${MAISY_COLORS.eye}"/>
      <circle cx="44.3" cy="12" r="0.6" fill="${MAISY_COLORS.pupil}"/>
      <!-- Ear bouncing high -->
      <path d="M39 12 C33 9 28 12 29 19 C31 22 35 20 37 15 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Tail flick -->
      <path d="M15 19 Q7 17 9 12 Q12 12 17 17 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Running Cycle: Frame 2 (Opposite stride reach)
  run2: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="22" rx="14" ry="9" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Rear legs extended backward -->
      <path d="M21 25 L13 36 L16 37 L24 26 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M18 24 L10 34 L13 35 L20 25 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Front legs forward -->
      <path d="M32 24 L39 36 L42 36 L36 24 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M35 24 L44 34 L47 33 L39 23 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Chest & White Flash -->
      <path d="M34 16 Q39 20 37 27 Q33 28 31 22 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M35 18 C37 20 37 24 35 26 C34 25 34 21 35 18 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head & Snout -->
      <circle cx="43" cy="15" r="7" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="48" cy="17" rx="5" ry="3.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="52" cy="15" r="1.5" fill="${MAISY_COLORS.nose}"/>
      <circle cx="44" cy="13" r="1.2" fill="${MAISY_COLORS.eye}"/>
      <circle cx="44.3" cy="13" r="0.6" fill="${MAISY_COLORS.pupil}"/>
      <!-- Ear streaming backward -->
      <path d="M40 12 C34 10 28 13 30 21 C33 23 37 21 38 16 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Tail -->
      <path d="M15 20 Q10 13 13 9 Q15 9 17 18 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Running Cycle: Frame 3 (Stride return)
  run3: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="21" rx="14" ry="9" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M21 25 L16 36 L19 37 L24 26 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M24 25 L21 37 L24 37 L26 26 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M34 25 L36 37 L39 37 L37 25 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M32 25 L32 36 L35 36 L35 25 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Chest & White Flash -->
      <path d="M34 16 Q39 20 37 27 Q33 28 31 22 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M35 18 C37 20 37 24 35 26 C34 25 34 21 35 18 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head -->
      <circle cx="43" cy="14" r="7" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="48" cy="16" rx="5" ry="3.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="52" cy="14" r="1.5" fill="${MAISY_COLORS.nose}"/>
      <circle cx="44" cy="12" r="1.2" fill="${MAISY_COLORS.eye}"/>
      <circle cx="44.3" cy="12" r="0.6" fill="${MAISY_COLORS.pupil}"/>
      <!-- Ear -->
      <path d="M39 12 C34 11 30 15 32 22 C34 24 37 22 38 16 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Tail -->
      <path d="M15 19 Q9 14 12 10 Q14 10 17 17 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Jump Pose: Legs tucked, ears swept aerodynamic, tail level
  jump: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="19" rx="15" ry="8.5" fill="${MAISY_COLORS.coatMid}" transform="rotate(-8 30 19)"/>
      <!-- Legs tucked neatly under body -->
      <path d="M19 22 Q15 28 20 30 Q24 30 23 24 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M34 21 Q32 28 37 29 Q40 28 38 22 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Chest & White Flash -->
      <path d="M37 14 Q42 18 40 24 Q36 26 33 20 Z" fill="${MAISY_COLORS.coatMid}"/>
      <path d="M38 16 C40 18 40 22 38 23 C37 22 37 18 38 16 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head angled up -->
      <circle cx="46" cy="13" r="6.5" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="51" cy="14" rx="4.5" ry="3.2" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="55" cy="12.5" r="1.4" fill="${MAISY_COLORS.nose}"/>
      <circle cx="47" cy="11.5" r="1.2" fill="${MAISY_COLORS.eye}"/>
      <circle cx="47.3" cy="11.5" r="0.6" fill="${MAISY_COLORS.pupil}"/>
      <!-- Spaniel Ears Swept Back Firmly by Air Velocity -->
      <path d="M42 11 C35 7 26 8 24 14 C26 17 33 16 38 14 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M26 12 C28 14 34 13 37 12" stroke="${MAISY_COLORS.coatHighlight}" stroke-width="0.8" fill="none"/>
      <!-- Tail streamlined -->
      <path d="M16 19 Q8 19 9 16 Q12 15 18 17 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Ducking Pose: Crouched low, 40% height reduction
  duck: {
    width: 60,
    height: 24,
    svg: `<svg viewBox="0 0 60 24" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="28" cy="14" rx="16" ry="6" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Crouched paws -->
      <path d="M14 16 L10 22 L15 22 L18 17 Z" fill="${MAISY_COLORS.coatDark}"/>
      <path d="M36 15 L43 22 L47 22 L40 16 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- White Flash -->
      <ellipse cx="37" cy="14" rx="1.5" ry="3.5" fill="${MAISY_COLORS.chestFlash}" transform="rotate(25 37 14)"/>
      <!-- Lowered Head & Snout -->
      <circle cx="45" cy="12" r="5.5" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="50" cy="14" rx="4" ry="2.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="53.5" cy="13" r="1.2" fill="${MAISY_COLORS.nose}"/>
      <circle cx="46" cy="10" r="1.0" fill="${MAISY_COLORS.eye}"/>
      <circle cx="46.3" cy="10" r="0.5" fill="${MAISY_COLORS.pupil}"/>
      <!-- Flattened Ear -->
      <path d="M41 9 C35 8 28 10 27 14 C29 16 34 14 38 11 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Low Tail -->
      <path d="M13 13 Q7 13 8 11 Q10 11 14 12 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },

  // Game Over Resting Pose: Sitting panting, tongue out, white flash clearly visible
  gameOver: {
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Sitting body posture -->
      <path d="M20 37 C15 37 18 24 26 20 C32 17 38 23 38 35 C38 37 24 37 20 37 Z" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Front paws straight down -->
      <rect x="33" y="24" width="4" height="13" rx="2" fill="${MAISY_COLORS.coatDark}"/>
      <rect x="37" y="24" width="4" height="13" rx="2" fill="${MAISY_COLORS.coatMid}"/>
      <!-- Resting hind leg -->
      <ellipse cx="23" cy="32" rx="7" ry="5" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Chest & Distinct Pure White Vertical Flash -->
      <path d="M33 20 C35 23 35 28 33 30 C32 29 32 22 33 20 Z" fill="${MAISY_COLORS.chestFlash}"/>
      <!-- Head resting upright -->
      <circle cx="36" cy="13" r="7" fill="${MAISY_COLORS.coatMid}"/>
      <ellipse cx="42" cy="15" rx="5" ry="3.5" fill="${MAISY_COLORS.coatDark}"/>
      <circle cx="46" cy="13.5" r="1.4" fill="${MAISY_COLORS.nose}"/>
      <!-- Happy tired eye -->
      <path d="M37 11 Q39 9 41 11" stroke="${MAISY_COLORS.eye}" stroke-width="1.2" fill="none"/>
      <!-- Panting Tongue -->
      <path d="M42 18 C43 22 45 22 45 18 Z" fill="${MAISY_COLORS.tongue}"/>
      <!-- Feathered Spaniel Ear resting naturally downward -->
      <path d="M32 11 C28 12 26 18 28 26 C30 28 33 26 33 19 Z" fill="${MAISY_COLORS.coatDark}"/>
      <!-- Tail resting on ground -->
      <path d="M18 36 Q12 36 10 33 Q12 31 19 33 Z" fill="${MAISY_COLORS.coatDark}"/>
    </svg>`,
  },
};

/**
 * Direct Canvas 2D render helper for high-performance 60fps game loops
 * without DOM overhead or image decoding lag.
 */
export function drawMaisy(
  ctx: CanvasRenderingContext2D,
  pose: 'run0' | 'run1' | 'run2' | 'run3' | 'jump' | 'duck' | 'gameOver',
  x: number,
  y: number,
  scale = 1,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  switch (pose) {
    case 'jump':
      drawJumpPose(ctx);
      break;
    case 'duck':
      drawDuckPose(ctx);
      break;
    case 'gameOver':
      drawGameOverPose(ctx);
      break;
    case 'run0':
      drawRunPose(ctx, 0);
      break;
    case 'run1':
      drawRunPose(ctx, 1);
      break;
    case 'run2':
      drawRunPose(ctx, 2);
      break;
    case 'run3':
    default:
      drawRunPose(ctx, 3);
      break;
  }

  ctx.restore();
}

function drawRunPose(ctx: CanvasRenderingContext2D, frame: number): void {
  // Body
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.ellipse(28, 22, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs according to frame stride
  ctx.fillStyle = MAISY_COLORS.coatDark;
  const legOffsets = [
    { r1: [18, 25, 12, 36], r2: [22, 25, 18, 38], f1: [35, 25, 42, 36], f2: [32, 25, 38, 38] },
    { r1: [19, 25, 17, 37], r2: [23, 25, 22, 36], f1: [33, 25, 32, 37], f2: [31, 25, 29, 36] },
    { r1: [18, 24, 10, 34], r2: [21, 25, 13, 36], f1: [35, 24, 44, 34], f2: [32, 24, 39, 36] },
    { r1: [21, 25, 16, 36], r2: [24, 25, 21, 37], f1: [34, 25, 36, 37], f2: [32, 25, 32, 36] },
  ][frame];

  // Draw legs
  ctx.beginPath();
  ctx.moveTo(legOffsets.r1[0], legOffsets.r1[1]);
  ctx.lineTo(legOffsets.r1[2], legOffsets.r1[3]);
  ctx.lineTo(legOffsets.r1[2] + 3, legOffsets.r1[3]);
  ctx.lineTo(legOffsets.r1[0] + 3, legOffsets.r1[1]);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.moveTo(legOffsets.r2[0], legOffsets.r2[1]);
  ctx.lineTo(legOffsets.r2[2], legOffsets.r2[3]);
  ctx.lineTo(legOffsets.r2[2] + 3, legOffsets.r2[3]);
  ctx.lineTo(legOffsets.r2[0] + 3, legOffsets.r2[1]);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.moveTo(legOffsets.f1[0], legOffsets.f1[1]);
  ctx.lineTo(legOffsets.f1[2], legOffsets.f1[3]);
  ctx.lineTo(legOffsets.f1[2] + 3, legOffsets.f1[3]);
  ctx.lineTo(legOffsets.f1[0] + 3, legOffsets.f1[1]);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.moveTo(legOffsets.f2[0], legOffsets.f2[1]);
  ctx.lineTo(legOffsets.f2[2], legOffsets.f2[3]);
  ctx.lineTo(legOffsets.f2[2] + 3, legOffsets.f2[3]);
  ctx.lineTo(legOffsets.f2[0] + 3, legOffsets.f2[1]);
  ctx.fill();

  // White chest flash (Working Cocker Spaniel trademark)
  ctx.fillStyle = MAISY_COLORS.chestFlash;
  ctx.beginPath();
  ctx.ellipse(35, 21, 1.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.arc(43, 14.5, 7, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.ellipse(48, 16.5, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = MAISY_COLORS.nose;
  ctx.beginPath();
  ctx.arc(52, 14.5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = MAISY_COLORS.eye;
  ctx.beginPath();
  ctx.arc(44, 12.5, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = MAISY_COLORS.pupil;
  ctx.beginPath();
  ctx.arc(44.3, 12.5, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Ear (Flowing with motion)
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  const earY = frame === 1 ? 9 : frame === 2 ? 10 : 12;
  ctx.moveTo(40, earY);
  ctx.quadraticCurveTo(30, earY + 2, 33, earY + 11);
  ctx.quadraticCurveTo(38, earY + 10, 39, earY + 5);
  ctx.closePath();
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(15, 20);
  ctx.quadraticCurveTo(8, 14, 11, 10);
  ctx.quadraticCurveTo(14, 10, 17, 18);
  ctx.closePath();
  ctx.fill();
}

function drawJumpPose(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.ellipse(30, 19, 15, 8.5, -0.14, 0, Math.PI * 2);
  ctx.fill();

  // Paws tucked
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.ellipse(20, 26, 4, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(35, 25, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // White chest flash
  ctx.fillStyle = MAISY_COLORS.chestFlash;
  ctx.beginPath();
  ctx.ellipse(38, 19, 1.5, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head angled
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.arc(46, 13, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.ellipse(51, 14, 4.5, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose & Eye
  ctx.fillStyle = MAISY_COLORS.nose;
  ctx.beginPath();
  ctx.arc(55, 12.5, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.eye;
  ctx.beginPath();
  ctx.arc(47, 11.5, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = MAISY_COLORS.pupil;
  ctx.beginPath();
  ctx.arc(47.3, 11.5, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Aerodynamic Ear (swept straight back)
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.moveTo(42, 11);
  ctx.quadraticCurveTo(30, 7, 24, 13);
  ctx.quadraticCurveTo(30, 16, 38, 14);
  ctx.closePath();
  ctx.fill();

  // Tail streamlined
  ctx.beginPath();
  ctx.moveTo(16, 19);
  ctx.quadraticCurveTo(8, 18, 9, 15);
  ctx.quadraticCurveTo(12, 15, 18, 17);
  ctx.closePath();
  ctx.fill();
}

function drawDuckPose(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.ellipse(28, 14, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Paws flat
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.fillRect(10, 18, 8, 4);
  ctx.fillRect(38, 18, 8, 4);

  // White chest flash
  ctx.fillStyle = MAISY_COLORS.chestFlash;
  ctx.beginPath();
  ctx.ellipse(37, 14, 1.2, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Low head
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.arc(45, 12, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.ellipse(50, 14, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = MAISY_COLORS.nose;
  ctx.beginPath();
  ctx.arc(53.5, 13, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Flat ear
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.moveTo(41, 9);
  ctx.quadraticCurveTo(31, 8, 27, 13);
  ctx.quadraticCurveTo(34, 14, 38, 11);
  ctx.closePath();
  ctx.fill();
}

function drawGameOverPose(ctx: CanvasRenderingContext2D): void {
  // Sitting body
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.beginPath();
  ctx.moveTo(20, 37);
  ctx.quadraticCurveTo(16, 25, 26, 20);
  ctx.quadraticCurveTo(34, 18, 38, 35);
  ctx.lineTo(20, 37);
  ctx.fill();

  // Front paws
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.fillRect(33, 24, 4, 13);
  ctx.fillStyle = MAISY_COLORS.coatMid;
  ctx.fillRect(37, 24, 4, 13);

  // White chest flash
  ctx.fillStyle = MAISY_COLORS.chestFlash;
  ctx.beginPath();
  ctx.ellipse(33, 25, 1.5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(36, 13, 7, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.ellipse(42, 15, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = MAISY_COLORS.nose;
  ctx.beginPath();
  ctx.arc(46, 13.5, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Tongue panting happily
  ctx.fillStyle = MAISY_COLORS.tongue;
  ctx.beginPath();
  ctx.ellipse(43, 19, 2, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Relaxed ear
  ctx.fillStyle = MAISY_COLORS.coatDark;
  ctx.beginPath();
  ctx.moveTo(32, 11);
  ctx.quadraticCurveTo(27, 13, 28, 24);
  ctx.quadraticCurveTo(32, 25, 33, 18);
  ctx.closePath();
  ctx.fill();
}
