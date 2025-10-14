import { Task } from '@/types/task';

// Keywords for detecting action items
const SCHEDULING_KEYWORDS = [
  'schedule', 'interview', 'meeting', 'appointment', 'slot',
  'available', 'when can', 'time', 'date', 'reschedule'
];

const FOLLOWUP_KEYWORDS = [
  'follow up', 'update', 'status', 'any news', 'heard back',
  'progress', 'waiting', 'pending', 'check'
];

const STATUSUPDATE_KEYWORDS = [
  'result', 'outcome', 'feedback', 'decision', 'next step',
  'what happened', 'how did', 'passed', 'failed'
];

export class TaskExtractor {
  /**
   * Extract tasks from a WhatsApp message
   */
  static extractTask(
    message: string,
    senderName: string,
    senderNumber: string
  ): Task | null {
    // Simple heuristic: if message contains a question mark or action keywords
    const hasQuestion = message.includes('?');
    const lowerMessage = message.toLowerCase();

    // Check if message contains any action keywords
    const isScheduling = SCHEDULING_KEYWORDS.some(keyword =>
      lowerMessage.includes(keyword)
    );
    const isFollowUp = FOLLOWUP_KEYWORDS.some(keyword =>
      lowerMessage.includes(keyword)
    );
    const isStatusUpdate = STATUSUPDATE_KEYWORDS.some(keyword =>
      lowerMessage.includes(keyword)
    );

    // If no action detected, return null
    if (!hasQuestion && !isScheduling && !isFollowUp && !isStatusUpdate) {
      return null;
    }

    // Determine category and priority
    let category: Task['category'] = 'general';
    let priority: Task['priority'] = 'medium';

    if (isScheduling) {
      category = 'scheduling';
      priority = 'high';
    } else if (isFollowUp) {
      category = 'follow-up';
      priority = 'medium';
    } else if (isStatusUpdate) {
      category = 'status-update';
      priority = 'medium';
    }

    // Extract task description (first 100 chars or until first question mark)
    let taskDescription = message;
    if (message.length > 100) {
      taskDescription = message.substring(0, 100) + '...';
    }

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      candidateName: senderName,
      candidateNumber: senderNumber,
      taskDescription,
      originalMessage: message,
      timestamp: new Date(),
      priority,
      status: 'new',
      category,
    };
  }

  /**
   * Batch process multiple messages
   */
  static extractTasks(
    messages: Array<{
      message: string;
      senderName: string;
      senderNumber: string;
    }>
  ): Task[] {
    return messages
      .map(msg => this.extractTask(msg.message, msg.senderName, msg.senderNumber))
      .filter((task): task is Task => task !== null);
  }
}
