'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WalkingHero from './WalkingHero';

// Drops the playable hero onto a sub-page. Unlike the home page he has no
// origin box to hop down from, so he simply walks in from the left edge.
//
// Sub-pages have no pipe and no Mario enemies — those belong to the home page.
// They do get their own, longer row of blocks, so the stage still has something
// to headbutt without looking like a copy of the home screen.
//
// `onTalk` fires with true/false as the hero walks up to the NPC and away, so
// the page can open and close the conversation. The hero is never frozen: he
// stays fully controllable, and walking away simply ends the conversation.
export default function StageHero({ npc, onTalk, next }) {
  const router = useRouter();
  const [, setTalking] = useState(false);

  const handleTalk = (isTalking) => {
    setTalking(isTalking);
    onTalk?.(isTalking);
  };

  return (
    <WalkingHero
      spawnFrom="left"
      showPipe={false}
      showEnemies={false}
      blockLayout="stage"
      npc={npc}
      onTalkChange={handleTalk}
      onEnterPipe={() => next && router.push(next)}
    />
  );
}
