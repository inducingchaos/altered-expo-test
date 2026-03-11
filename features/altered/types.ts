export type ThoughtStatus = 'inbox' | 'active' | 'queued' | 'blocked' | 'archived';

export type AppearanceMode = 'system' | 'light' | 'dark';

export type Thought = {
  id: string;
  title: string;
  body: string;
  datasets: string[];
  status: ThoughtStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  validated: boolean;
};

export type Validation = {
  id: string;
  label: string;
  detail: string;
  status: 'pending' | 'clear' | 'flagged';
};

export type Shortcut = {
  id: string;
  label: string;
  detail: string;
};

export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  createdAt: string;
};

export type SystemMode = {
  id: string;
  name: string;
  description: string;
  command: string;
};

export type AppState = {
  thoughts: Thought[];
  searchQuery: string;
  activeDataset: string | null;
  validations: Validation[];
  shortcuts: Shortcut[];
  chatMessages: ChatMessage[];
  systemModes: SystemMode[];
  appearanceMode: AppearanceMode;
};
