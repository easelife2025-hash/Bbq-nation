import { NextResponse } from 'next/server';

// In-memory store for demo purposes
let globalBookings: any[] = [];

export async function GET() {
  return NextResponse.json(globalBookings);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    globalBookings = [data, ...globalBookings];
    
    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    globalBookings = globalBookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 400 });
  }
}
