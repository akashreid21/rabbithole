export interface Task {
  id: string;
  candidateName: string;
  candidateNumber: string;
  taskDescription: string;
  originalMessage: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'completed';
  category: 'scheduling' | 'follow-up' | 'status-update' | 'general';
}

export interface TaskStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  byCategory: {
    scheduling: number;
    followUp: number;
    statusUpdate: number;
    general: number;
  };
}
