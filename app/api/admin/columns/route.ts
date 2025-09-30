import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: Record<string, string> = {};

    if (category && category !== 'すべて') {
      where.category = category;
    }

    if (status && status !== 'すべて') {
      where.status = status;
    }

    const columns = await prisma.columns.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      }
    });

    // データを整形
    const formattedColumns = columns.map((column) => ({
      id: column.id,
      title: column.title,
      category: column.category,
      content: column.content,
      thumbnail: column.thumbnail_url,
      status: column.status === 'published' ? '表示' : '非表示',
      views: column.views || 0,
      created_at: column.created_at,
      updated_at: column.updated_at,
    }));

    return NextResponse.json(formattedColumns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch columns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, content, status, thumbnail } = body;

    const column = await prisma.columns.create({
      data: {
        title,
        category,
        content,
        thumbnail_url: thumbnail,
        status: status === '表示' ? 'published' : 'draft',
        slug: title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
        views: 0,
      }
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error('Error creating column:', error);
    return NextResponse.json(
      { error: 'Failed to create column' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, content, status, thumbnail } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Column ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (content !== undefined) updateData.content = content;
    if (thumbnail !== undefined) updateData.thumbnail_url = thumbnail;
    if (status !== undefined) {
      updateData.status = status === '表示' ? 'published' : 'draft';
    }

    updateData.updated_at = new Date();

    const updatedColumn = await prisma.columns.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error('Error updating column:', error);
    return NextResponse.json(
      { error: 'Failed to update column' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Column ID is required' },
        { status: 400 }
      );
    }

    await prisma.columns.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting column:', error);
    return NextResponse.json(
      { error: 'Failed to delete column' },
      { status: 500 }
    );
  }
}