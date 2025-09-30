import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: Record<string, string> = {};

    if (status && status !== 'すべて') {
      const statusMap: Record<string, string> = {
        '未対応': 'PENDING',
        '対応中': 'IN_PROGRESS',
        '対応完了': 'COMPLETED',
      };
      where.inquiry_status = statusMap[status] || status;
    }

    const inquiries = await prisma.inquiries.findMany({
      where,
      include: {
        customers: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // データを整形
    const formattedInquiries = inquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.customers?.customer_name || '',
      email: inquiry.customers?.customer_email || '',
      phone: inquiry.customers?.customer_phone || '',
      subject: inquiry.subject,
      message: inquiry.inquiry_content,
      status: inquiry.inquiry_status,
      admin_memo: inquiry.admin_memo,
      created_at: inquiry.created_at,
      updated_at: inquiry.updated_at,
    }));

    return NextResponse.json(formattedInquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { inquiryId, updates } = body;

    if (!inquiryId) {
      return NextResponse.json(
        { error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    // statusフィールドをinquiry_statusに変換
    if (updates.status) {
      updates.inquiry_status = updates.status;
      delete updates.status;
    }

    const updatedInquiry = await prisma.inquiries.update({
      where: { id: inquiryId },
      data: updates,
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inquiryId, responseMessage } = body;

    if (!inquiryId || !responseMessage) {
      return NextResponse.json(
        { error: 'Inquiry ID and response message are required' },
        { status: 400 }
      );
    }

    // 対応履歴を追加（この機能は将来的に拡張可能）
    const updatedInquiry = await prisma.inquiries.update({
      where: { id: inquiryId },
      data: {
        inquiry_status: 'IN_PROGRESS',
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error('Error adding response:', error);
    return NextResponse.json(
      { error: 'Failed to add response' },
      { status: 500 }
    );
  }
}