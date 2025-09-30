import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await loginAdmin(username, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      admin: {
        id: result.admin?.id,
        username: result.admin?.username,
        email: result.admin?.email,
        role: result.admin?.role,
      },
    });

    response.cookies.set('admin-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login process error' },
      { status: 500 }
    );
  }
}