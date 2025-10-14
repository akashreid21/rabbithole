import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { TaskExtractor } from './taskExtractor';
import { Task } from '@/types/task';

export class WhatsAppService {
  private client: Client;
  private tasks: Task[] = [];
  private isReady: boolean = false;
  private latestQR: string = '';
  private isInitializing: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // QR Code generation
    this.client.on('qr', (qr) => {
      console.log('========================================');
      console.log('QR Code received! Scan with WhatsApp:');
      console.log('========================================');
      console.log(qr);
      console.log('========================================');
      this.latestQR = qr;
    });

    // Client ready
    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    // Authentication success
    this.client.on('authenticated', () => {
      console.log('WhatsApp authenticated successfully');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      console.error('Authentication failed:', msg);
    });

    // Incoming messages
    this.client.on('message', async (message: Message) => {
      await this.handleIncomingMessage(message);
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      this.isReady = false;
    });
  }

  private async handleIncomingMessage(message: Message) {
    try {
      // Get contact info
      const contact = await message.getContact();
      const senderName = contact.pushname || contact.name || 'Unknown';
      const senderNumber = contact.number;

      // Extract task from message
      const task = TaskExtractor.extractTask(
        message.body,
        senderName,
        senderNumber
      );

      if (task) {
        this.tasks.push(task);
        console.log('New task detected:', task.taskDescription);
        // In production, emit to frontend via WebSocket or API
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async initialize() {
    if (this.isInitializing) {
      console.log('Already initializing...');
      return;
    }
    console.log('Initializing WhatsApp client...');
    this.isInitializing = true;
    try {
      await this.client.initialize();
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error);
      this.isInitializing = false;
      throw error;
    }
  }

  async disconnect() {
    await this.client.destroy();
    this.isReady = false;
    this.isInitializing = false;
    this.latestQR = '';
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  updateTaskStatus(id: string, status: Task['status']): boolean {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.status = status;
      return true;
    }
    return false;
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  isClientReady(): boolean {
    return this.isReady;
  }

  getQRCode(): string {
    return this.latestQR;
  }

  isInitializingClient(): boolean {
    return this.isInitializing;
  }
}

// Singleton instance
let whatsappService: WhatsAppService | null = null;

export function getWhatsAppService(): WhatsAppService {
  if (!whatsappService) {
    whatsappService = new WhatsAppService();
  }
  return whatsappService;
}
