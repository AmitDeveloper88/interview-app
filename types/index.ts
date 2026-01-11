export interface Topic {
  slug: string;
  name: string;
  color: string;
}

export interface Question {
  id: string;
  q: string;
  a: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface TopicData {
  slug: string;
  questions: Question[];
}