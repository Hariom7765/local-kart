import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const whereClause: Record<string, unknown> = {};

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { address: { contains: query } },
        { category: { contains: query } },
        {
          products: {
            some: {
              name: { contains: query },
            },
          },
        },
      ];
    }

    const shops = await prisma.shop.findMany({
      where: whereClause,
      include: {
        products: true,
      },
      orderBy: [
        { isPromoted: 'desc' },
        { isVerified: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, address, phone, latitude, longitude, isVerified, isPromoted } = body;

    if (!name || !category || !address || !phone) {
      return NextResponse.json(
        { error: 'Name, Category, Address, and Phone are required' },
        { status: 400 }
      );
    }

    const newShop = await prisma.shop.create({
      data: {
        name,
        category,
        address,
        phone,
        latitude: parseFloat(latitude) || 28.6139,
        longitude: parseFloat(longitude) || 77.209,
        isVerified: Boolean(isVerified),
        isPromoted: Boolean(isPromoted),
      },
    });

    return NextResponse.json(newShop, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}
