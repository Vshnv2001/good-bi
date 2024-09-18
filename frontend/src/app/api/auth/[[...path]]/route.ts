import { getAppDirRequestHandler } from 'supertokens-node/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { ensureSuperTokensInit } from '../../../config/backend';

ensureSuperTokensInit();

const handleCall = getAppDirRequestHandler(NextResponse);

export async function GET(request: NextRequest) {
  console.log('Received GET request');  
  const res = await handleCall(request);
  if (!res.headers.has('Cache-Control')) {
    // This is needed for production deployments with Vercel
    res.headers.set(
      'Cache-Control',
      'no-cache, no-store, max-age=0, must-revalidate'
    )
  }
  return res;
}

export async function POST(request: NextRequest) {
  try {
    const response = await handleCall(request);
    console.log(response);
    console.log('POST request handled successfully');
    return response;
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  return handleCall(request);
}

export async function PUT(request: NextRequest) {
  return handleCall(request);
}

export async function PATCH(request: NextRequest) {
  return handleCall(request);
}

export async function HEAD(request: NextRequest) {
  return handleCall(request);
}