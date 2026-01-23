
export interface Bird {
  id: string;
  name: string;
  images: string[];
  group: string;
}

export interface Question {
  correctBird: Bird;
  imageUrl: string;
  options: Bird[];
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export interface Score {
  correct: number;
  total: number;
}
