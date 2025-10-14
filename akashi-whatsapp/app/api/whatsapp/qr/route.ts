import { NextResponse } from 'next/server';
import { getWhatsAppService } from '@/services/whatsappService';

export async function GET() {
  try {
    const service = getWhatsAppService();
    const qr = service.getQRCode();
    const isInitializing = service.isInitializingClient();

    return NextResponse.json({
      qr,
      isInitializing
    });
  } catch (error) {
    console.error('Error getting QR code:', error);
    return NextResponse.json(
      { error: 'Failed to get QR code' },
      { status: 500 }
    );
  }
}
