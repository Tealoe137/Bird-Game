
import { Bird, Question } from './types';
import { BIRD_LIST } from './birdData';

/**
 * Shuffles an array in place.
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generates a new question with smart distractors.
 */
export function generateQuestion(allowedBirds: Bird[] = BIRD_LIST): Question {
  // 1. Pick a random bird from the allowed list
  const correctBird = allowedBirds[Math.floor(Math.random() * allowedBirds.length)];
  
  // 2. Pick a random image from that bird
  const imageUrl = correctBird.images[Math.floor(Math.random() * correctBird.images.length)];

  // 3. Find birds in the same group from the allowed list
  let potentialDistractors = allowedBirds.filter(b => b.id !== correctBird.id && b.group === correctBird.group);

  // If we don't have enough similar birds, backfill with random birds from the allowed list
  if (potentialDistractors.length < 3) {
    const others = shuffle(allowedBirds.filter(b => b.id !== correctBird.id && b.group !== correctBird.group));
    potentialDistractors = [...potentialDistractors, ...others];
  }

  // If we STILL don't have enough (e.g., user selected < 4 birds), backfill from the full list
  if (potentialDistractors.length < 3) {
    const fullListOthers = shuffle(BIRD_LIST.filter(b => b.id !== correctBird.id && !allowedBirds.find(a => a.id === b.id)));
    potentialDistractors = [...potentialDistractors, ...fullListOthers];
  }

  // 4. Select 3 distractors
  const distractors = shuffle(potentialDistractors).slice(0, 3);

  // 5. Combine and shuffle options
  const options = shuffle([correctBird, ...distractors]);

  return {
    correctBird,
    imageUrl,
    options
  };
}
