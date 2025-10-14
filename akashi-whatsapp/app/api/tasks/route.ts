import { NextResponse } from 'next/server';
import { getWhatsAppService } from '@/services/whatsappService';

export async function GET() {
  try {
    const service = getWhatsAppService();
    const tasks = service.getTasks();

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
