import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // トークンを生成
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30日間有効

    // 受注情報を取得
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        quotations: {
          include: {
            diagnosis_requests: {
              include: {
                customers: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // 顧客情報を更新してトークンを保存
    const customerId = order.quotations?.diagnosis_requests?.customer_id;

    if (customerId) {
      await prisma.customers.update({
        where: { id: customerId },
        data: {
          review_token: token,
          review_token_expires_at: expiresAt,
        }
      });
    }

    // レビューURL生成
    const reviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/review/${token}`;

    return NextResponse.json({
      success: true,
      reviewUrl,
      token,
      expiresAt,
      customerEmail
    });
  } catch (error) {
    console.error('Error generating review token:', error);
    return NextResponse.json(
      { error: 'Failed to generate review token' },
      { status: 500 }
    );
  }
}