import { NextResponse } from 'next/server';
import { getWhatsAppService } from '@/services/whatsappService';

export async function POST() {
  try {
    const service = getWhatsAppService();

    if (service.isClientReady()) {
      return NextResponse.json({
        status: 'already_connected',
        message: 'WhatsApp is already connected'
      });
    }

    // Initialize connection (this will trigger QR code generation)
    service.initialize();

    return NextResponse.json({
      status: 'connecting',
      message: 'Connecting to WhatsApp... Check console for QR code'
    });
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error);
    return NextResponse.json(
      { error: 'Failed to connect to WhatsApp' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const service = getWhatsAppService();
    return NextResponse.json({
      connected: service.isClientReady()
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    );
  }
}
