import { NextResponse } from 'next/server';

// In-memory store for demo purposes
let globalOrders: any[] = [];

export async function GET() {
  // We don't fetch from Firebase here because the admin dashboard uses real-time listeners directly.
  // This endpoint is mostly for the fallback.
  return NextResponse.json(globalOrders);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    globalOrders = [data, ...globalOrders];
    
    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    globalOrders = globalOrders.map(order => 
      order.id === id ? { ...order, status } : order
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 });
  }
}
