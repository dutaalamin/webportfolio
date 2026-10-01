'use client';

import { useEffect, useRef } from 'react';

// The home page's hero. He starts life as the big character standing under the
// role text, then at DROP_DELAY he hops down onto the grass and becomes
// playable with WASD / the arrow keys.
//
// A green Mario-style pipe stands on the grass. Walking into it makes him sink
// down the pipe, which then hands off to the next page via onEnterPipe.
//
// He always renders hello.gif as-is, so the character never changes appearance.

const SPEED = 215; // px per second while walking
const GAME_H = 88; // hero height once he is standing on the grass
const ASPECT = 233 / 500; // hello.gif is 233x500
const GAME_W = GAME_H * ASPECT;

const DROP_DELAY = 4200; // ms he waits in place before jumping down
const DROP_MS = 1050; // descent duration

const PIPE_W = 66; // pipe shaft width
const PIPE_RIM_W = 80; // the lip is a little wider than the shaft
const PIPE_RIM_H = 24;
// The pipe is planted IN the ground. Its mouth rises PIPE_RISE above the grass
// line the hero walks on, and the shaft runs down into the soil where it is
// clipped — so it reads as driven into the earth, not resting on top of it.
const PIPE_RISE = 150;
// Generous drawn height; the bottom is clipped away at the soil line, so this
// only needs to be tall enough to reach past it.
const PIPE_H = 320;
const PIPE_X_FRAC = 0.68; // where the pipe stands, as a fraction of the width
const PIPE_ENTER_MS = 1100; // how long the descent into the pipe takes
const PIPE_SINK = 120; // how far below the rim he slides before vanishing

// Jump physics. Space launches the hero on an arc; the peak works out at about
// 216px, comfortably above the 150px pipe mouth so he can clear the rim.
const JUMP_V = 720; // initial upward velocity, px per second
const GRAVITY = 1200; // downward acceleration, px per second squared

// Walking off the right-hand edge leaves the stage, same as the pipe.
const EXIT_MS = 700; // how long the walk-off takes

// Mario-style enemies. They march in from the right and can be stomped.
const ENEMY_COUNT = 3;
const ENEMY_W = 42; // rendered sprite size
const ENEMY_H = 42;
const ENEMY_SPEED = 62; // px per second, right to left
const ENEMY_GAP_MS = 2400; // quiet time before the next one walks on
const ENEMY_FIRST_MS = 1400; // delay after the hero lands before the first
const ENEMY_SQUASH_MS = 420; // how long the flattened sprite lingers
const STOMP_BOUNCE = 0.62; // fraction of JUMP_V regained on a stomp
const HURT_MS = 900; // invulnerability window after taking a side hit
const KNOCKBACK = 46; // px the hero is shoved back by a side hit

// How close the hero must stand before an NPC starts talking to him. There are
// two thresholds on purpose: opening slightly further out than closing stops the
// dialogue flickering on and off while he stands right at the boundary.
const NPC_TALK_RANGE = 62;
const NPC_TALK_RELEASE = 88;
// NPCs are drawn a touch smaller than the hero so the player stays the focus.
const NPC_H = 104;
const NPC_ASPECT = 383 / 545; // hero2.gif is 383x545

// Mario-style blocks floating above the grass. Bumping one from below either
// shatters it (brick) or pops a coin out of it (question block).
const BLOCK_SIZE = 42;
const BLOCK_BUMP_MS = 200; // bump animation length
const BLOCK_HEAD_BOUNCE = 240; // downward speed after a headbutt
// Two different rows, so the sub-pages do not look like a copy of the home
// page. 'home' is the short row before the pipe; 'stage' is a longer row
// centred on the screen. 'coin' pays out, 'break' shatters, 'solid' just bumps.
const BLOCK_LAYOUTS = {
  home: {
    centerFrac: 0.36,
    rise: 195,
    kinds: ['coin', 'break', 'solid', 'coin', 'break', 'solid'],
  },
  stage: {
    centerFrac: 0.42,
    rise: 210,
    kinds: [
      'coin', 'break', 'break', 'coin', 'solid',
      'break', 'coin', 'break', 'solid', 'coin',
    ],
  },
};
const MAX_BLOCKS = Math.max(
  ...Object.values(BLOCK_LAYOUTS).map((l) => l.kinds.length),
);
const COIN_SIZE = 22;
const COIN_V = 430; // initial upward speed of a popped coin
const COIN_MS = 640; // how long a coin lives
const FRAG_SIZE = 12;
const FRAG_MS = 720; // how long brick shards live
// Node pools. Sized for the worst case: every block paying out at once.
const COIN_POOL = MAX_BLOCKS;
const FRAG_POOL = MAX_BLOCKS * 4;

// Measuring ground.png (ignoring the flower, whose stem is also green) showed
// the grass strip occupies rows 190..327 of 490, i.e. 0.388..0.667. The roam
// band is that strip, so his feet always stand on grass — never floating in the
// sky above it, never sunk into the soil cross-section below it.
const WALK_TOP_FRAC = 0.39;
const WALK_BOTTOM_FRAC = 0.665;

// Fallback band, used only if the ground art cannot be measured.
const FALLBACK_TOP = 300;
const FALLBACK_BOTTOM = 120;

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const lerp = (a, b, t) => (a + (b - a) * t);

// A shaded cylinder: dark at the edges, bright down the middle.
const PIPE_GRAD =
  'linear-gradient(90deg, #14501a 0%, #2b8f33 16%, #6fd47a 36%, #a8f0ae 46%, #6fd47a 58%, #2b8f33 82%, #0f3d13 100%)';

export default function WalkingHero({
  originRef,
  onDeparted,
  onEnterPipe,
  spawnFrom = 'top',
  showBlocks = true,
  blockLayout = 'home',
  showPipe = true,
  showEnemies = true,
  npc = null,
  onTalkChange,
}) {
  const nodeRef = useRef(null);
  const pipeRef = useRef(null);
  const npcRef = useRef(null);
  // Which block row to use, and whether the Mario enemies walk in at all. Home
  // has both; the sub-pages get their own row and no enemies.
  const layout = BLOCK_LAYOUTS[blockLayout] ?? BLOCK_LAYOUTS.home;
  const enemiesOn = showEnemies;
  // 'top' spawns under the home page's role text and drops down; 'left' walks
  // in from the left edge, which is how the sub-pages introduce him.
  const fromLeft = spawnFrom === 'left';
  // The NPC is read from inside the animation loop, so it is mirrored into a
  // ref. Putting it in the effect deps would restart the whole animation on
  // every parent render.
  const npcDataRef = useRef(npc);
  npcDataRef.current = npc;
  const talkRef = useRef(onTalkChange);
  talkRef.current = onTalkChange;
  // One DOM node per enemy; created up front and recycled, so the loop never
  // has to touch React state.
  const enemyRefs = useRef([]);
  // One node per block, plus a pool of shard nodes for brick breakages.
  const blockRefs = useRef([]);
  const fragRefs = useRef([]);
  const coinRefs = useRef([]);
  // Keep the latest callbacks in refs. Putting them in the effect deps would
  // restart the whole animation every time the parent re-renders.
  const departedRef = useRef(onDeparted);
  departedRef.current = onDeparted;
  const enterPipeRef = useRef(onEnterPipe);
  enterPipeRef.current = onEnterPipe;

  useEffect(() => {
    const el = nodeRef.current;
    const pipe = pipeRef.current;
    const origin = originRef?.current;
    // The origin box only exists on the home page. Sub-pages spawn him from the
    // left edge instead, so it is allowed to be missing there. The pipe is
    // optional too: pages that have no pipe pass showPipe={false}.
    if (!el || (!pipe && showPipe) || (!origin && !fromLeft)) return;

    const keys = new Set();
    // Jump and enter requests are latched so a quick keypress is never missed
    // between two animation frames.
    let jumpQueued = false;
    // The enter press is buffered with a timestamp: pressing Down just before
    // touching down still counts, but a stale press does not linger forever.
    let enterQueuedAt = 0;
    const ENTER_BUFFER_MS = 250;
    // Enemies. Each has an active flag, a position and a squash timer.
    const enemies = Array.from({ length: ENEMY_COUNT }, () => ({
      active: false,
      x: 0,
      squashUntil: 0,
    }));
    let nextSpawn = 0; // timestamp for the next walk-on
    let hurtUntil = 0; // hero invulnerability window
    let flashOn = false; // used to blink the hero while hurt
    // Blocks, coins and brick shards. All are plain records written straight to
    // DOM nodes each frame; none of this touches React state.
    const blocks = layout.kinds.map((kind, i) => ({
      kind, // 'coin' | 'break' | 'solid'
      i,
      x: 0,
      y: 0,
      dead: false,
      bumpUntil: 0,
      hit: false, // a coin block only pays out once
    }));
    const coins = [];
    const frags = [];
    const s = {
      phase: 'idle', // idle -> drop -> walk -> exit -> pipe -> done
      x: 0, // centre X, viewport px
      feet: 0, // feet Y, viewport px
      h: 0,
      walkT: 0,
      vy: 0, // vertical velocity while airborne
      prevFeet: 0, // feet Y at the start of the frame, for swept collisions
      airborne: false,
      // groundFeet is the grass line he stands on. It is the only surface he can
      // rest on, apart from the pipe rim, so vertical keys no longer move him.
      groundFeet: 0,
      dropStart: 0,
      exitStart: 0,
      exitFromX: 0,
      pipeStart: 0,
      pipeFromX: 0,
      pipeFromFeet: 0,
      from: { x: 0, feet: 0, h: 0 },
      to: { x: 0, feet: 0, h: 0 },
      grassTop: 0,
      grassBottom: 0,
      pipeX: 0,
      pipeMouthY: 0,
      pipeSoilY: 0,
      // Where the NPC stands (viewport px). 0 when the page has no NPC.
      npcX: 0,
      npcFeet: 0,
      talking: false,
    };

    const measure = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Where the layout character currently sits. The <img> is object-contain
      // inside its box, so work out its rendered size from the aspect ratio.
      // Sub-pages have no such box; the left-spawn path fills these in below.
      if (origin) {
        const r = origin.getBoundingClientRect();
        const scale = Math.min(r.width / 233, r.height / 500);
        const w = 233 * scale;
        const h = 500 * scale;
        s.originX = r.left + (r.width - w) / 2 + w / 2;
        s.originFeet = r.top + h;
        s.originH = h;
      }

      // The roam band, derived from the ground artwork so it adapts to any
      // screen size. Measuring ground.png showed the grass strip runs from 39%
      // to 66.5% of the art's height; below that is the soil cross-section. The
      // hero roams that strip, so his feet always stand on grass.
      const ground = document.querySelector('img[src*="ground.png"]');
      if (ground) {
        const g = ground.getBoundingClientRect();
        s.grassTop = g.top + g.height * WALK_TOP_FRAC;
        s.grassBottom = g.top + g.height * WALK_BOTTOM_FRAC;
      } else {
        s.grassTop = vh - FALLBACK_TOP;
        s.grassBottom = vh - FALLBACK_BOTTOM;
      }
      s.grassMid = (s.grassTop + s.grassBottom) / 2;
      s.vw = vw;

      // The pipe is planted in the ground. grassBottom is where the grass meets
      // the soil, so the mouth rises PIPE_RISE above that line and the shaft is
      // clipped there — leaving the pipe visibly buried in the earth.
      // With no pipe, it is parked far off-screen so no collision ever fires.
      s.pipeX = showPipe ? vw * PIPE_X_FRAC : -100000;
      s.pipeSoilY = s.grassBottom; // grass/soil boundary
      s.pipeMouthY = s.pipeSoilY - PIPE_RISE;

      // The block row floats in the sky above the grass. It hangs off the soil
      // line so it keeps its height relative to the ground at any screen size.
      // Blocks are laid edge to edge, centred on one point, so they form a
      // single unbroken row.
      const rowLeft = vw * layout.centerFrac - (blocks.length * BLOCK_SIZE) / 2;
      blocks.forEach((b) => {
        b.x = rowLeft + b.i * BLOCK_SIZE + BLOCK_SIZE / 2;
        b.y = s.pipeSoilY - layout.rise;
      });
      if (!showBlocks) blocks.forEach((b) => (b.dead = true));

      // The NPC stands on the grass to the right of the hero's landing spot,
      // so the player has to walk over and meet them.
      if (npcDataRef.current) {
        s.npcX = vw * (npcDataRef.current.xFrac ?? 0.62);
        s.npcFeet = s.grassMid;
      }

      if (s.phase === 'idle') {
        // Left spawn: start just off the left edge, on the grass, at game size.
        if (fromLeft) {
          s.x = -GAME_W;
          s.feet = s.grassMid;
          s.h = GAME_H;
        } else {
          s.x = s.originX;
          s.feet = s.originFeet;
          s.h = s.originH;
        }
      }
    };

    measure();

    const onResize = () => {
      const wasIdle = s.phase === 'idle';
      // Remember whether he was perched on the rim before the geometry moved.
      const wasOnRim = !s.airborne && Math.abs(s.feet - s.pipeMouthY) < 4;
      measure();
      if (wasIdle) return;
      s.x = Math.min(Math.max(s.x, GAME_W / 2), s.vw - GAME_W / 2);
      // The grass line is the only place he can stand, so snap him back to it —
      // unless he was standing on the pipe, in which case follow the new rim.
      s.groundFeet = s.grassMid;
      if (!s.airborne) s.feet = wasOnRim ? s.pipeMouthY : s.grassMid;
    };
    window.addEventListener('resize', onResize);

    const onDown = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
      // Space, Up arrow and W all jump. Up no longer moves him vertically, so
      // it is free to double as the jump key.
      if (k === ' ' || k === 'spacebar' || k === 'arrowup' || k === 'w') jumpQueued = true;
      if (k === 'arrowdown' || k === 's') enterQueuedAt = performance.now();
      keys.add(k);
    };
    const onUp = (e) => keys.delete(e.key.toLowerCase());
    const onBlur = () => {
      keys.clear();
      jumpQueued = false;
      enterQueuedAt = 0;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);

    // Lowest unused slot in a fixed-size node pool, or -1 when full.
    const firstFree = (list, size) => {
      for (let i = 0; i < size; i++) {
        if (!list.some((k) => k.slot === i)) return i;
      }
      return -1;
    };

    // Send the next idle enemy in from just past the right edge.
    const spawnEnemy = () => {
      const free = enemies.find((e) => !e.active);
      if (!free) return;
      free.active = true;
      free.x = s.vw + ENEMY_W;
      free.squashUntil = 0;
    };

    let raf = 0;
    let last = performance.now();
    // The pipe is hidden until its position is set, to avoid a flash at 0,0.
    let revealed = false;

    const step = (now) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (s.phase === 'idle') {
        if (fromLeft) {
          // Sub-pages: no drop, he simply walks in from the left edge.
          s.x = -GAME_W;
          s.feet = s.grassMid;
          s.h = GAME_H;
          if (now - startTime >= DROP_DELAY) {
            s.phase = 'walk';
            s.groundFeet = s.grassMid;
            s.vy = 0;
            s.airborne = false;
            s.walkT = 0.001;
            nextSpawn = now + ENEMY_FIRST_MS;
          }
        } else {
          s.x = s.originX;
          s.feet = s.originFeet;
          s.h = s.originH;
          if (now - startTime >= DROP_DELAY) {
            s.phase = 'drop';
            s.dropStart = now;
            departedRef.current?.();
            s.from = { x: s.originX, feet: s.originFeet, h: s.originH };
            s.to = {
              x: Math.min(Math.max(s.originX, GAME_W / 2), s.vw - GAME_W / 2),
              feet: s.grassMid,
              h: GAME_H,
            };
          }
        }
      } else if (s.phase === 'drop') {
        const t = Math.min((now - s.dropStart) / DROP_MS, 1);
        const e = easeInOut(t);
        s.x = lerp(s.from.x, s.to.x, e);
        s.feet = lerp(s.from.feet, s.to.feet, e);
        s.h = lerp(s.from.h, s.to.h, e);
        if (t >= 1) {
          s.phase = 'walk';
          s.h = GAME_H;
          s.feet = s.grassMid;
          s.groundFeet = s.grassMid;
          s.vy = 0;
          s.airborne = false;
          // Give him a beat on the grass before the first enemy walks on.
          nextSpawn = now + ENEMY_FIRST_MS;
        }
      } else if (s.phase === 'exit') {
        // Walked off the right edge: keep striding right until he is fully
        // off-screen, then hand off to the next page.
        const t = Math.min((now - s.exitStart) / EXIT_MS, 1);
        s.x = lerp(s.exitFromX, s.vw + GAME_W, easeInOut(t));
        s.walkT += dt;
        if (t >= 1) {
          s.phase = 'done';
          enterPipeRef.current?.();
        }
      } else if (s.phase === 'pipe') {
        const t = Math.min((now - s.pipeStart) / PIPE_ENTER_MS, 1);
        // He is already standing on the mouth, so this phase only slides him
        // down inside — a clearly downward motion into the opening.
        const sink = easeInOut(t);
        s.feet = lerp(s.pipeFromFeet, s.pipeMouthY + PIPE_SINK, sink);
        s.x = lerp(s.pipeFromX, s.pipeX, Math.min(t / 0.3, 1));
        el.style.opacity = String(1 - Math.max(0, (t - 0.4) / 0.6));
        if (t >= 1) {
          el.style.opacity = '0';
          // Move to a terminal phase so the hand-off fires exactly once.
          // Calling it every frame spams the router and the navigation is lost.
          s.phase = 'done';
          enterPipeRef.current?.();
        }
      } else if (s.phase === 'done') {
        el.style.opacity = '0';
      } else {
        let dx = 0;
        if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
        if (keys.has('arrowright') || keys.has('d')) dx += 1;
        // Left spawn: he strolls in on his own until he is clearly on screen,
        // so the player sees him arrive rather than popping into place.
        if (fromLeft && s.x < GAME_W * 3) dx = 1;

        // --- NPC ---
        // Standing next to the NPC starts the conversation; walking away ends
        // it. The talk state is pushed to the parent so it can open the box.
        if (npcDataRef.current) {
          const dist = Math.abs(s.x - s.npcX);
          // Hysteresis: start talking within NPC_TALK_RANGE, only stop once he
          // has backed off past NPC_TALK_RELEASE.
          const near = s.talking ? dist < NPC_TALK_RELEASE : dist < NPC_TALK_RANGE;
          if (near !== s.talking) {
            s.talking = near;
            talkRef.current?.(near);
          }
        }

        const rimHalf = PIPE_RIM_W * 0.42;
        // Is he at or above the rim right now? The rim only counts as a surface
        // from above — below it, the pipe is just an obstacle. Without this the
        // pipe footprint could leave him falling forever when he is underneath.
        const aboveRim = s.feet <= s.pipeMouthY + 2;
        // The wall stops him just outside the rim footprint so that a straight
        // jump up from the wall always ends with him inside the support span.
        const wallHalf = rimHalf - 2;
        const onPipeSpan = aboveRim && Math.abs(s.x - s.pipeX) <= rimHalf;

        // --- blocks ---
        // A block only acts as a wall when it vertically overlaps the hero's
        // body. The row floats above head height, so he walks under it freely;
        // jumping up into one is a headbutt.
        const halfB = BLOCK_SIZE / 2;
        const heroHalfW = GAME_W / 2;
        const heroTop = s.feet - s.h;
        const bumpable = (b) => !b.dead && b.bumpUntil < now;
        const blocksTouching = blocks.filter(
          (b) =>
            bumpable(b) &&
            b.y + halfB > heroTop &&
            b.y - halfB < s.feet,
        );
        const hitsBlockAt = (x) =>
          blocksTouching.find((b) => Math.abs(x - b.x) < heroHalfW + halfB - 6);

        // --- horizontal movement (allowed on the ground and mid-air) ---
        // The pipe is a solid wall from the side, so at grass level it blocks
        // him; the only way across is to jump over it.
        if (dx !== 0) {
          const nextX = s.x + dx * SPEED * dt;
          const wouldEnter = Math.abs(nextX - s.pipeX) <= wallHalf;
          const blocked = hitsBlockAt(nextX);
          if (blocked) {
            // stop him flush against the block's side
            s.x = blocked.x - Math.sign(dx) * (heroHalfW + halfB);
          } else if (wouldEnter && !aboveRim) {
            const edge = s.pipeX - Math.sign(dx) * wallHalf;
            s.x = dx > 0 ? Math.min(nextX, edge) : Math.max(nextX, edge);
          } else {
            s.x = nextX;
          }
          s.walkT += dt;
        } else {
          s.walkT = 0;
        }

        // --- surface underfoot ---
        // The rim is a raised platform over the pipe's footprint; the top of a
        // block is a platform too. Otherwise he stands on the grass line.
        let surfaceY = onPipeSpan ? s.pipeMouthY : s.groundFeet;
        // A block only holds him up when he is at or above its top, so rising
        // through it from below is a headbutt rather than a landing.
        const standOn = blocks.find(
          (b) =>
            !b.dead &&
            Math.abs(s.x - b.x) < heroHalfW + halfB - 6 &&
            s.feet <= b.y - halfB + 4,
        );
        if (standOn && standOn.y - halfB < surfaceY) surfaceY = standOn.y - halfB;

        // --- jumping ---
        if (jumpQueued && !s.airborne) {
          s.airborne = true;
          s.vy = -JUMP_V;
        }
        jumpQueued = false;

        if (s.airborne) {
          const prevFeet = s.feet;
          s.prevFeet = prevFeet;
          s.vy += GRAVITY * dt;
          s.feet += s.vy * dt;

          // Headbutt: rising, and the head crossed a block's underside. Skipped
          // when he is standing on top of that very block.
          if (s.vy < 0) {
            const headPrev = prevFeet - s.h;
            const headNow = s.feet - s.h;
            const hitBlock = blocks.find(
              (b) =>
                bumpable(b) &&
                Math.abs(s.x - b.x) < heroHalfW + halfB - 6 &&
                !(standOn === b) &&
                headPrev >= b.y + halfB - 2 &&
                headNow <= b.y + halfB,
            );
            if (hitBlock) {
              hitBlock.bumpUntil = now + BLOCK_BUMP_MS;
              s.feet = hitBlock.y + halfB + s.h;
              s.vy = BLOCK_HEAD_BOUNCE;
              // A 'solid' block only bumps — no payout, no breakage.
              if (hitBlock.kind === 'coin' && !hitBlock.hit) {
                hitBlock.hit = true;
                const slot = firstFree(coins, COIN_POOL);
                if (slot >= 0) {
                  coins.push({ slot, x: hitBlock.x, y: hitBlock.y, start: now });
                }
              } else if (hitBlock.kind === 'break') {
                hitBlock.dead = true;
                for (let k = 0; k < 4; k++) {
                  const slot = firstFree(frags, FRAG_POOL);
                  if (slot < 0) break;
                  frags.push({
                    slot,
                    x: hitBlock.x + (k % 2 ? 12 : -12),
                    y: hitBlock.y + (k < 2 ? -10 : 10),
                    vx: (k % 2 ? 1 : -1) * 90,
                    vy: (k < 2 ? -1 : 1) * 110,
                    start: now,
                  });
                }
              }
            }
          }

          // Land only when he crosses the surface on the way down.
          if (s.vy > 0 && prevFeet <= surfaceY && s.feet >= surfaceY) {
            s.feet = surfaceY;
            s.vy = 0;
            s.airborne = false;
          }
        } else if (surfaceY > s.feet + 1) {
          // the ground fell away beneath him (he stepped off the rim)
          s.airborne = true;
          s.vy = 0;
        } else {
          s.feet = surfaceY;
          s.prevFeet = s.feet;
        }

        // stay on screen
        const maxX = s.vw - GAME_W / 2;
        s.x = Math.min(Math.max(s.x, GAME_W / 2), maxX);

        // Reaching the far right edge leaves the stage, like the pipe does.
        // Only while walking normally, and only if he is not up on the pipe.
        if (
          dx > 0 &&
          !s.airborne &&
          !onPipeSpan &&
          s.x >= maxX - 0.5
        ) {
          s.phase = 'exit';
          s.exitStart = now;
          s.exitFromX = s.x;
        }

        // --- enemies ---
        // They march right-to-left along the grass. Stomping one (landing on it
        // from above) squashes it and bounces the hero; touching one side-on
        // shoves him back and briefly makes him invulnerable. Only the home page
        // has them.
        if (enemiesOn && now >= nextSpawn) {
          spawnEnemy();
          nextSpawn = now + ENEMY_GAP_MS;
        }

        for (const e of enemies) {
          if (!e.active) continue;
          if (e.squashUntil) {
            if (now >= e.squashUntil) {
              e.active = false;
              e.squashUntil = 0;
            }
            continue;
          }
          e.x -= ENEMY_SPEED * dt;
          if (e.x < -ENEMY_W) {
            e.active = false;
            continue;
          }

          // Boxes overlap? The hero's body is [feet - h, feet]; the enemy's is
          // [enemyTop, groundFeet].
          const heroHalf = GAME_W / 2;
          const enemyTop = s.groundFeet - ENEMY_H;
          const overlapX = Math.abs(s.x - e.x) < heroHalf + ENEMY_W * 0.38;
          const heroTop = s.feet - s.h;
          const overlapY = s.feet > enemyTop + 4 && heroTop < s.groundFeet;
          if (!overlapX || !overlapY) continue;

          // Swept test: if he was still above the enemy's head at the start of
          // this frame and is falling, his feet crossed the top line — a stomp.
          // Checking the previous position keeps it reliable even at high fall
          // speeds, where the feet can skip past a narrow band in one frame.
          const stomping = s.airborne && s.vy > 0 && s.prevFeet <= enemyTop + 10;
          if (stomping) {
            e.squashUntil = now + ENEMY_SQUASH_MS;
            s.feet = enemyTop; // stand on its head for the bounce
            s.vy = -JUMP_V * STOMP_BOUNCE;
            s.airborne = true;
          } else if (now >= hurtUntil) {
            // Side hit: shove him away from the enemy and blink him.
            hurtUntil = now + HURT_MS;
            s.x += (s.x < e.x ? -1 : 1) * KNOCKBACK;
          }
        }

        // Safety net: if he is ever falling past the soil line, set him back on
        // the grass. Guarantees he can always jump again, whatever happens.
        if (s.airborne && s.feet > s.grassBottom + 40) {
          s.feet = s.groundFeet;
          s.vy = 0;
          s.airborne = false;
        }

        // Standing on the rim + pressing Down = climb into the pipe. The press
        // is buffered briefly, so one made just before touchdown still counts.
        const onRim = !s.airborne && onPipeSpan && Math.abs(s.feet - s.pipeMouthY) < 4;
        const enterWanted = enterQueuedAt && now - enterQueuedAt <= ENTER_BUFFER_MS;
        if (onRim && enterWanted) {
          s.phase = 'pipe';
          s.pipeStart = now;
          s.pipeFromX = s.x;
          s.pipeFromFeet = s.feet;
          el.style.opacity = '1';
          enterQueuedAt = 0;
        }
      }

      const moving =
        (s.phase === 'walk' || s.phase === 'exit') && s.walkT > 0;
      const hop = moving && !s.airborne ? -Math.abs(Math.sin(s.walkT * 9)) * 4 : 0;

      // Depth. The pipe stays behind him for the whole run so the descent into
      // the mouth is actually visible; the fade in the pipe phase is what sells
      // him disappearing inside. The hero node itself sits at z-6.
      if (pipe) pipe.style.zIndex = '5';

      el.style.width = `${s.h * ASPECT}px`;
      el.style.height = `${s.h}px`;
      el.style.transform =
        `translate3d(${s.x - (s.h * ASPECT) / 2}px, ${s.feet - s.h + hop}px, 0)`;

      // The NPC stands on the grass, breathing gently so they feel alive. The
      // sprite is drawn holding the Poké Ball on his right, which reads as
      // facing right — away from the hero arriving from the left — so the whole
      // node is mirrored to turn him around.
      if (npcRef.current && npcDataRef.current) {
        const bob = Math.sin(now / 620) * 1.5;
        const w = NPC_H * NPC_ASPECT;
        npcRef.current.style.width = `${w}px`;
        npcRef.current.style.height = `${NPC_H}px`;
        npcRef.current.style.transform =
          `translate3d(${s.npcX - w / 2}px, ${s.npcFeet - NPC_H + bob}px, 0) scaleX(-1)`;
        npcRef.current.style.opacity = '1';
      }

      // Blink while briefly invulnerable after a side hit.
      if (s.phase === 'walk' && now < hurtUntil) {
        flashOn = !flashOn;
        el.style.opacity = flashOn ? '0.35' : '1';
      } else if (s.phase === 'walk' && el.style.opacity !== '1') {
        el.style.opacity = '1';
      }

      // Enemies. Positions are written straight to the DOM nodes; inactive ones
      // are simply hidden.
      enemies.forEach((e, i) => {
        const node = enemyRefs.current[i];
        if (!node) return;
        if (!e.active) {
          node.style.opacity = '0';
          return;
        }
        const squashed = e.squashUntil > 0;
        node.style.opacity = '1';
        node.style.transformOrigin = 'bottom center';
        node.style.transform =
          `translate3d(${e.x - ENEMY_W / 2}px, ${s.groundFeet - ENEMY_H}px, 0)` +
          (squashed ? ' scaleY(0.28)' : '');
        node.style.filter = squashed ? 'brightness(0.55)' : 'none';
      });

      // Blocks. They bob up a few pixels while bumped, and vanish when broken.
      blocks.forEach((b, i) => {
        const node = blockRefs.current[i];
        if (!node) return;
        if (b.dead) {
          node.style.opacity = '0';
          return;
        }
        const bumping = b.bumpUntil > now;
        const t = bumping ? 1 - (b.bumpUntil - now) / BLOCK_BUMP_MS : 0;
        // Rise then settle: a single half-sine over the bump window.
        const lift = bumping ? -Math.sin(t * Math.PI) * 10 : 0;
        node.style.opacity = '1';
        node.style.transform =
          `translate3d(${b.x - BLOCK_SIZE / 2}px, ${b.y - BLOCK_SIZE / 2 + lift}px, 0)`;
      });

      // Coins pop out of a bumped block and arc back down before vanishing.
      // Each coin owns a fixed node slot, so one expiring never makes another
      // jump nodes mid-flight.
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        const age = (now - c.start) / 1000;
        if (age * 1000 >= COIN_MS) coins.splice(i, 1);
      }
      for (let slot = 0; slot < COIN_POOL; slot++) {
        const node = coinRefs.current[slot];
        if (!node) continue;
        const c = coins.find((k) => k.slot === slot);
        if (!c) {
          node.style.opacity = '0';
          continue;
        }
        const age = (now - c.start) / 1000;
        const y = c.y - COIN_V * age + 0.5 * GRAVITY * age * age;
        // Narrowing then widening width reads as the coin spinning.
        const spin = Math.abs(Math.cos(age * 14));
        node.style.opacity = String(Math.min(1, (COIN_MS / 1000 - age) * 4));
        node.style.transform =
          `translate3d(${c.x - COIN_SIZE / 2}px, ${y}px, 0) scaleX(${0.35 + spin * 0.65})`;
      }

      // Brick shards fly apart and fade.
      for (let i = frags.length - 1; i >= 0; i--) {
        if ((now - frags[i].start) >= FRAG_MS) frags.splice(i, 1);
      }
      for (let slot = 0; slot < FRAG_POOL; slot++) {
        const node = fragRefs.current[slot];
        if (!node) continue;
        const f = frags.find((k) => k.slot === slot);
        if (!f) {
          node.style.opacity = '0';
          continue;
        }
        const age = (now - f.start) / 1000;
        const x = f.x + f.vx * age;
        const y = f.y + f.vy * age + 0.5 * GRAVITY * age * age;
        node.style.opacity = String(Math.max(0, 1 - age / (FRAG_MS / 1000)));
        node.style.transform =
          `translate3d(${x - FRAG_SIZE / 2}px, ${y - FRAG_SIZE / 2}px, 0) rotate(${age * 420}deg)`;
      }

      // Pipe geometry, re-applied each frame so resizing stays correct. The
      // mouth sits above the grass line and the shaft is clipped at the soil
      // line, which is what makes the pipe look planted in the ground.
      if (pipe) {
        pipe.style.transform = `translate3d(${s.pipeX - PIPE_RIM_W / 2}px, ${s.pipeMouthY}px, 0)`;
        const buried = Math.max(0, s.pipeMouthY + PIPE_H - s.pipeSoilY);
        pipe.style.clipPath = `inset(0px 0px ${buried}px 0px)`;
        // Geometry is now correct, so the pipe can stop hiding from the
        // pre-frame flash. Done once, right after the first positioned frame.
        if (!revealed) {
          revealed = true;
          pipe.style.opacity = '1';
        }
      }
    };

    const startTime = performance.now();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [originRef, fromLeft, showBlocks, showPipe, layout, enemiesOn]);

  return (
    <>
      {/* Playable hero */}
      <div
        ref={nodeRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[6]"
        style={{
          backgroundImage: 'url(/images/hello.gif)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))',
          willChange: 'transform',
        }}
      />

      {/* The NPC who stands on the grass and talks when you walk up to them.
          Position is driven by the animation loop. */}
      {npc && (
        <div
          ref={npcRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[6]"
          style={{
            width: NPC_H * NPC_ASPECT,
            height: NPC_H,
            opacity: 0,
            backgroundImage: `url(${npc.sprite || '/images/hero2.gif'})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom center',
            filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))',
            willChange: 'transform',
          }}
        />
      )}

      {/* Mario-style pipe. Only on pages that have one. It starts invisible:
          its transform is only applied on the first animation frame, so without
          that it would flash at 0,0. */}
      {showPipe && (
        <div
          ref={pipeRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[7]"
          style={{
            width: PIPE_RIM_W,
            height: PIPE_H,
            opacity: 0,
            willChange: 'transform',
          }}
        >
        {/* shaft — runs from under the lip all the way down, and the part below
            the soil line is clipped away so the pipe looks buried */}
        <div
          style={{
            position: 'absolute',
            left: (PIPE_RIM_W - PIPE_W) / 2,
            top: PIPE_RIM_H,
            width: PIPE_W,
            height: PIPE_H - PIPE_RIM_H,
            background: PIPE_GRAD,
            boxShadow: 'inset -6px 0 8px rgba(0,0,0,0.35)',
          }}
        />
        {/* lip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PIPE_RIM_W,
            height: PIPE_RIM_H,
            background: PIPE_GRAD,
            borderTop: '3px solid #0b2e0e',
            boxShadow: 'inset -7px 0 8px rgba(0,0,0,0.32), 0 2px 0 rgba(0,0,0,0.3)',
          }}
        />
        {/* the dark opening */}
        <div
          style={{
            position: 'absolute',
            left: (PIPE_RIM_W - PIPE_W + 12) / 2,
            top: 5,
            width: PIPE_W - 12,
            height: 11,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 35%, #1d6b24 0%, #0c2f10 55%, #041106 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.85)',
          }}
        />
        </div>
      )}

      {/* Floating blocks. 'coin' question blocks pay out once, 'break' bricks
          shatter, and 'solid' blocks are plain and just bump. */}
      {showBlocks && layout.kinds.map((kind, i) => (
        <div
          key={i}
          ref={(n) => {
            blockRefs.current[i] = n;
          }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[5] flex items-center justify-center"
          style={{
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
            opacity: 0,
            willChange: 'transform',
            fontFamily: 'var(--font-pressStart)',
            fontSize: 20,
            color: '#ffd93b',
            textShadow: '0 2px 0 rgba(0,0,0,0.5)',
            background:
              kind === 'coin'
                ? 'linear-gradient(180deg, #ffb020 0%, #e07b0c 100%)'
                : 'linear-gradient(180deg, #b5651d 0%, #8a4513 100%)',
            border: '3px solid #3a1d06',
            borderRadius: 3,
            boxShadow:
              'inset -4px -4px 0 rgba(0,0,0,0.25), inset 4px 4px 0 rgba(255,255,255,0.25)',
          }}
        >
          {kind === 'coin' ? '?' : ''}
        </div>
      ))}

      {/* Pooled coin nodes, shown only while a coin is in flight. */}
      {Array.from({ length: COIN_POOL }, (_, i) => (
        <div
          key={`c${i}`}
          ref={(n) => {
            coinRefs.current[i] = n;
          }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[6]"
          style={{
            width: COIN_SIZE,
            height: COIN_SIZE,
            opacity: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #fff6b0 0%, #ffd93b 45%, #d69b06 100%)',
            border: '2px solid #a8720a',
            willChange: 'transform',
          }}
        />
      ))}

      {/* Pooled brick shard nodes. */}
      {Array.from({ length: FRAG_POOL }, (_, i) => (
        <div
          key={`f${i}`}
          ref={(n) => {
            fragRefs.current[i] = n;
          }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[6]"
          style={{
            width: FRAG_SIZE,
            height: FRAG_SIZE,
            opacity: 0,
            background: '#b5651d',
            border: '2px solid #3a1d06',
            borderRadius: 2,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Enemies. Positions are driven by the animation loop; they start
          hidden and slide in from the right edge. Home page only. */}
      {showEnemies && Array.from({ length: ENEMY_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(n) => {
            enemyRefs.current[i] = n;
          }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[4]"
          style={{
            width: ENEMY_W,
            height: ENEMY_H,
            opacity: 0,
            backgroundImage: 'url(/images/psyduck.gif)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom center',
            filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.3))',
            willChange: 'transform',
          }}
        />
      ))}
    </>
  );
}
