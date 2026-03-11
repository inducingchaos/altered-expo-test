import React from 'react';

import type { AppState, Objective, ProposedChange, Thought, ThoughtStatus } from './types';

type AlteredContextValue = {
  state: AppState;
  visibleThoughts: Thought[];
  datasetCounts: Array<{ name: string; count: number }>;
  addThought: (text: string, datasetInput: string) => void;
  setThoughtStatus: (id: string, status: ThoughtStatus) => void;
  setActiveDataset: (dataset: string | null) => void;
  updateObjective: (objective: Objective) => void;
  resolveChange: (id: string, status: ProposedChange['status']) => void;
};

const initialState: AppState = {
  objective: {
    title: 'Generate first $2k from ALTERED in 14 days',
    outcome: 'Turn scattered strategy notes into a focused execution system and ship a believable prototype.',
    timeframe: '14 days',
    constraints: 'Low budget, solo execution, quality bar must stay high.',
    successCriteria: 'One usable prototype, one proof artifact, first paid client conversation.',
  },
  thoughts: [
    {
      id: 't-1',
      text: 'Clarify objective before importing more context so downstream decisions have an anchor.',
      datasets: ['objective', 'workflow'],
      status: 'open',
      createdAt: '2026-03-11T08:00:00.000Z',
    },
    {
      id: 't-2',
      text: 'Datasets should stay lightweight and composable, not hard-coded categories.',
      datasets: ['datasets', 'product-core'],
      status: 'in-progress',
      createdAt: '2026-03-11T08:15:00.000Z',
    },
    {
      id: 't-3',
      text: 'Review queue should keep user in control for trust.',
      datasets: ['trust', 'proposals'],
      status: 'open',
      createdAt: '2026-03-11T08:25:00.000Z',
    },
  ],
  proposedChanges: [
    {
      id: 'c-1',
      title: 'Promote "Clarify Objective" as first command',
      reason: 'All planning quality depends on objective precision.',
      status: 'pending',
    },
    {
      id: 'c-2',
      title: 'Split mobile prototype into Brain / Datasets / Objective',
      reason: 'Shows durable primitives while preserving campaign-specific workflow.',
      status: 'pending',
    },
  ],
  activeDataset: null,
};

type Action =
  | { type: 'add-thought'; text: string; datasets: string[] }
  | { type: 'set-thought-status'; id: string; status: ThoughtStatus }
  | { type: 'set-active-dataset'; dataset: string | null }
  | { type: 'update-objective'; objective: Objective }
  | { type: 'resolve-change'; id: string; status: ProposedChange['status'] };

const AlteredContext = React.createContext<AlteredContextValue | null>(null);

function normalizeDatasets(datasetInput: string): string[] {
  return datasetInput
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'add-thought': {
      const nextThought: Thought = {
        id: `t-${Date.now()}`,
        text: action.text.trim(),
        datasets: action.datasets,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        thoughts: [nextThought, ...state.thoughts],
      };
    }
    case 'set-thought-status': {
      return {
        ...state,
        thoughts: state.thoughts.map((thought) =>
          thought.id === action.id ? { ...thought, status: action.status } : thought
        ),
      };
    }
    case 'set-active-dataset': {
      return {
        ...state,
        activeDataset: action.dataset,
      };
    }
    case 'update-objective': {
      return {
        ...state,
        objective: action.objective,
      };
    }
    case 'resolve-change': {
      return {
        ...state,
        proposedChanges: state.proposedChanges.map((change) =>
          change.id === action.id ? { ...change, status: action.status } : change
        ),
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
    if (!state.activeDataset) {
      return state.thoughts;
    }

    return state.thoughts.filter((thought) => thought.datasets.includes(state.activeDataset as string));
  }, [state.activeDataset, state.thoughts]);

  const value = React.useMemo<AlteredContextValue>(
    () => ({
      state,
      visibleThoughts,
      datasetCounts,
      addThought: (text, datasetInput) => {
        if (!text.trim()) {
          return;
        }

        const datasets = normalizeDatasets(datasetInput);
        dispatch({ type: 'add-thought', text, datasets });
      },
      setThoughtStatus: (id, status) => dispatch({ type: 'set-thought-status', id, status }),
      setActiveDataset: (dataset) => dispatch({ type: 'set-active-dataset', dataset }),
      updateObjective: (objective) => dispatch({ type: 'update-objective', objective }),
      resolveChange: (id, status) => dispatch({ type: 'resolve-change', id, status }),
    }),
    [datasetCounts, state, visibleThoughts]
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
