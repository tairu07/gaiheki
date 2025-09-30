import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where = status && status !== 'すべて'
      ? { order_status: status as OrderStatus }
      : {};

    const orders = await prisma.orders.findMany({
      where,
      include: {
        quotations: {
          include: {
            diagnosis_requests: {
              select: {
                diagnosis_code: true,
                customers: {
                  select: {
                    customer_name: true,
                    customer_phone: true,
                    customer_email: true,
                    construction_address: true,
                  }
                },
              }
            },
            partners: {
              select: {
                username: true,
                partner_details: {
                  select: {
                    company_name: true,
                  }
                }
              }
            },
          }
        },
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // データを整形
    const formattedOrders = orders.map((order) => {
      const customer = order.quotations?.diagnosis_requests?.customers;

      return {
        id: order.id,
        diagnosisCode: order.quotations?.diagnosis_requests?.diagnosis_code || '',
        customerName: customer?.customer_name || '',
        phone: customer?.customer_phone || '',
        email: customer?.customer_email || '',
        address: customer?.construction_address || '',
        partnerName: order.quotations?.partners?.partner_details?.company_name || order.quotations?.partners?.username || '',
        orderAmount: order.quotations?.quotation_amount ? `${(order.quotations.quotation_amount / 10000).toFixed(0)}万円` : '0万円',
        orderDate: order.created_at.toLocaleDateString('ja-JP'),
        constructionStart: order.construction_start_date?.toLocaleDateString('ja-JP') || '未定',
        constructionEnd: order.construction_end_date?.toLocaleDateString('ja-JP') || '未定',
        status: order.order_status,
        notes: order.partner_memo || '',
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, updates } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // ステータス更新の場合、適切な型に変換
    if (updates.status) {
      updates.order_status = updates.status;
      delete updates.status;
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: updates,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}