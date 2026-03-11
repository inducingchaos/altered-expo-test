import React from 'react';

import type {
  AppearanceMode,
  AppState,
  ChatMessage,
  Shortcut,
  SystemMode,
  Thought,
  ThoughtStatus,
  Validation,
} from './types';

type AlteredContextValue = {
  state: AppState;
  visibleThoughts: Thought[];
  datasetCounts: Array<{ name: string; count: number }>;
  queueThoughts: Thought[];
  recentThoughts: Thought[];
  addThought: (payload: { body: string; datasetInput: string }) => void;
  updateThoughtStatus: (id: string, status: ThoughtStatus) => void;
  setActiveDataset: (dataset: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleThoughtPinned: (id: string) => void;
  toggleThoughtValidated: (id: string) => void;
  sendChatMessage: (text: string) => void;
  setAppearanceMode: (mode: AppearanceMode) => void;
};

const shortcuts: Shortcut[] = [
  { id: 'capture', label: 'Quick capture', detail: 'Drop any thought into the database.' },
  { id: 'queue', label: 'Open queue', detail: 'See active, pinned, and blocked work.' },
  { id: 'chat', label: 'Ask kAI', detail: 'Query ALTERED directly against current context.' },
];

const validations: Validation[] = [
  {
    id: 'v-1',
    label: 'Tag consistency',
    detail: 'Two thoughts still use overlapping product-core datasets.',
    status: 'pending',
  },
  {
    id: 'v-2',
    label: 'Queue pressure',
    detail: 'Pinned thoughts are below the preferred working set of five.',
    status: 'clear',
  },
  {
    id: 'v-3',
    label: 'Trust surface',
    detail: 'Action menu language is clean, but destructive options need stronger separation.',
    status: 'flagged',
  },
];

const systemModes: SystemMode[] = [
  {
    id: 's-1',
    name: 'Capture',
    description: 'Low-friction ingestion for notes, clarifications, and fragments.',
    command: '/capture --dataset product-core',
  },
  {
    id: 's-2',
    name: 'Query',
    description: 'Search thoughts, datasets, and relations with terse retrieval syntax.',
    command: '/query datasets:trust "review queue"',
  },
  {
    id: 's-3',
    name: 'Transform',
    description: 'Turn stored thoughts into plans, validations, or AI-ready prompts.',
    command: '/transform queued --output actions',
  },
  {
    id: 's-4',
    name: 'Publish',
    description: 'Use systems to route context into tasks, docs, or outbound artifacts.',
    command: '/publish thought:t-103 --target docs',
  },
];

const chatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    text: 'ALTERED is online. Ask for a recall, transformation, or next-action pass.',
    createdAt: '2026-03-11T08:30:00.000Z',
  },
  {
    id: 'm-2',
    role: 'user',
    text: 'What is the strongest thread around trust in the current thought base?',
    createdAt: '2026-03-11T08:32:00.000Z',
  },
  {
    id: 'm-3',
    role: 'assistant',
    text: 'The dominant trust thread is preserving explicit user approval between transformation and execution.',
    createdAt: '2026-03-11T08:32:15.000Z',
  },
];

const initialThoughts: Thought[] = [
  {
    id: 't-101',
    title: 'Review queue preserves trust',
    body: 'Any transformation layer should keep an explicit validation step so the user remains the decision-maker before work is sequenced.',
    datasets: ['trust', 'validations', 'queue'],
    status: 'active',
    source: 'strategy vault',
    createdAt: '2026-03-11T08:00:00.000Z',
    updatedAt: '2026-03-11T08:00:00.000Z',
    pinned: true,
    validated: true,
  },
  {
    id: 't-102',
    title: 'Datasets stay composable',
    body: 'Datasets should remain lightweight tags instead of rigid folder hierarchies so the same thought can live in multiple working views.',
    datasets: ['datasets', 'product-core'],
    status: 'queued',
    source: 'notes import',
    createdAt: '2026-03-11T08:11:00.000Z',
    updatedAt: '2026-03-11T08:14:00.000Z',
    pinned: false,
    validated: false,
  },
  {
    id: 't-103',
    title: 'Mobile launcher should feel intentional',
    body: 'The app should borrow Raycast clarity without becoming ornamental: compact typography, controlled contrast, more structure, less softness.',
    datasets: ['ui', 'product-core'],
    status: 'active',
    source: 'design brief',
    createdAt: '2026-03-11T08:18:00.000Z',
    updatedAt: '2026-03-11T08:21:00.000Z',
    pinned: true,
    validated: false,
  },
  {
    id: 't-104',
    title: 'kAI needs direct access to context',
    body: 'Chat should feel like a direct bridge into the thought database, not a detached assistant shell.',
    datasets: ['kai', 'query', 'systems'],
    status: 'inbox',
    source: 'product direction',
    createdAt: '2026-03-11T08:24:00.000Z',
    updatedAt: '2026-03-11T08:24:00.000Z',
    pinned: false,
    validated: false,
  },
  {
    id: 't-105',
    title: 'Systems turn storage into leverage',
    body: 'Capture alone is not enough. Altered needs explicit system surfaces that route thoughts into workflows, prompts, and outputs.',
    datasets: ['systems', 'automation'],
    status: 'blocked',
    source: 'architecture',
    createdAt: '2026-03-11T08:28:00.000Z',
    updatedAt: '2026-03-11T08:31:00.000Z',
    pinned: false,
    validated: true,
  },
];

const initialState: AppState = {
  thoughts: initialThoughts,
  searchQuery: '',
  activeDataset: null,
  validations,
  shortcuts,
  chatMessages,
  systemModes,
  appearanceMode: 'system',
};

type Action =
  | { type: 'add-thought'; body: string; datasets: string[] }
  | { type: 'update-thought-status'; id: string; status: ThoughtStatus }
  | { type: 'set-active-dataset'; dataset: string | null }
  | { type: 'set-search-query'; query: string }
  | { type: 'toggle-thought-pinned'; id: string }
  | { type: 'toggle-thought-validated'; id: string }
  | { type: 'send-chat-message'; text: string }
  | { type: 'set-appearance-mode'; mode: AppearanceMode };

const AlteredContext = React.createContext<AlteredContextValue | null>(null);

function normalizeDatasets(datasetInput: string): string[] {
  return datasetInput
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

function buildTitle(body: string) {
  const trimmed = body.trim();
  if (!trimmed) {
    return 'Untitled thought';
  }

  const words = trimmed.split(/\s+/).slice(0, 5).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function withUpdatedThought(state: AppState, id: string, updater: (thought: Thought) => Thought): AppState {
  return {
    ...state,
    thoughts: state.thoughts.map((thought) => (thought.id === id ? updater(thought) : thought)),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'add-thought': {
      const now = new Date().toISOString();
      const nextThought: Thought = {
        id: `t-${Date.now()}`,
        title: buildTitle(action.body),
        body: action.body.trim(),
        datasets: action.datasets,
        status: 'inbox',
        source: 'quick capture',
        createdAt: now,
        updatedAt: now,
        pinned: false,
        validated: false,
      };

      return {
        ...state,
        thoughts: [nextThought, ...state.thoughts],
      };
    }
    case 'update-thought-status': {
      return withUpdatedThought(state, action.id, (thought) => ({
        ...thought,
        status: action.status,
        updatedAt: new Date().toISOString(),
      }));
    }
    case 'set-active-dataset': {
      return {
        ...state,
        activeDataset: action.dataset,
      };
    }
    case 'set-search-query': {
      return {
        ...state,
        searchQuery: action.query,
      };
    }
    case 'toggle-thought-pinned': {
      return withUpdatedThought(state, action.id, (thought) => ({
        ...thought,
        pinned: !thought.pinned,
        updatedAt: new Date().toISOString(),
      }));
    }
    case 'toggle-thought-validated': {
      return withUpdatedThought(state, action.id, (thought) => ({
        ...thought,
        validated: !thought.validated,
        updatedAt: new Date().toISOString(),
      }));
    }
    case 'send-chat-message': {
      const createdAt = new Date().toISOString();
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          { id: `m-${Date.now()}`, role: 'user', text: action.text, createdAt },
          {
            id: `m-${Date.now()}-reply`,
            role: 'assistant',
            text: `ALTERED indexed that request. Strongest matching surfaces: ${state.thoughts
              .slice(0, 2)
              .map((thought) => thought.title)
              .join(' • ')}.`,
            createdAt,
          },
        ],
      };
    }
    case 'set-appearance-mode': {
      return {
        ...state,
        appearanceMode: action.mode,
      };
    }
    default: {
      return state;
    }
  }
}

export function AlteredProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const datasetCounts = React.useMemo(() => {
    const counter = new Map<string, number>();

    for (const thought of state.thoughts) {
      for (const dataset of thought.datasets) {
        counter.set(dataset, (counter.get(dataset) ?? 0) + 1);
      }
    }

    return [...counter.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [state.thoughts]);

  const visibleThoughts = React.useMemo(() => {
    const query = state.searchQuery.trim().toLowerCase();

    return state.thoughts.filter((thought) => {
      const matchesDataset = state.activeDataset ? thought.datasets.includes(state.activeDataset) : true;
      const matchesQuery =
        !query ||
        thought.title.toLowerCase().includes(query) ||
        thought.body.toLowerCase().includes(query) ||
        thought.datasets.some((dataset) => dataset.includes(query));

      return matchesDataset && matchesQuery;
    });
  }, [state.activeDataset, state.searchQuery, state.thoughts]);

  const queueThoughts = React.useMemo(
    () => state.thoughts.filter((thought) => thought.pinned || thought.status === 'active' || thought.status === 'blocked'),
    [state.thoughts]
  );

  const recentThoughts = React.useMemo(() => [...state.thoughts].slice(0, 4), [state.thoughts]);

  const value = React.useMemo<AlteredContextValue>(
    () => ({
      state,
      visibleThoughts,
      datasetCounts,
      queueThoughts,
      recentThoughts,
      addThought: ({ body, datasetInput }) => {
        if (!body.trim()) {
          return;
        }

        dispatch({ type: 'add-thought', body, datasets: normalizeDatasets(datasetInput) });
      },
      updateThoughtStatus: (id, status) => dispatch({ type: 'update-thought-status', id, status }),
      setActiveDataset: (dataset) => dispatch({ type: 'set-active-dataset', dataset }),
      setSearchQuery: (query) => dispatch({ type: 'set-search-query', query }),
      toggleThoughtPinned: (id) => dispatch({ type: 'toggle-thought-pinned', id }),
      toggleThoughtValidated: (id) => dispatch({ type: 'toggle-thought-validated', id }),
      sendChatMessage: (text) => {
        if (!text.trim()) {
          return;
        }

        dispatch({ type: 'send-chat-message', text: text.trim() });
      },
      setAppearanceMode: (mode) => dispatch({ type: 'set-appearance-mode', mode }),
    }),
    [datasetCounts, queueThoughts, recentThoughts, state, visibleThoughts]
  );

  return <AlteredContext.Provider value={value}>{children}</AlteredContext.Provider>;
}

export function useAltered() {
  const context = React.useContext(AlteredContext);
  if (!context) {
    throw new Error('useAltered must be used inside AlteredProvider.');
  }

  return context;
}
