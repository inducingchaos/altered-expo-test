export type ThoughtStatus = 'open' | 'in-progress' | 'blocked' | 'done';

export type Thought = {
  id: string;
  text: string;
  datasets: string[];
  status: ThoughtStatus;
  createdAt: string;
};

export type Objective = {
  title: string;
  outcome: string;
  timeframe: string;
  constraints: string;
  successCriteria: string;
};

export type ProposedChange = {
  id: string;
  title: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type AppState = {
  objective: Objective;
  thoughts: Thought[];
  proposedChanges: ProposedChange[];
  activeDataset: string | null;
};
