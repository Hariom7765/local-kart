import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email || null;
    let user = null;
    if (email) {
      try {
        user = await prisma.user.findUnique({ where: { email } });
      } catch (_) {}
    }

    // Find or locate shop associated with this user
    let shop = null;
    try {
      if (user?.shopName) {
        shop = await prisma.shop.findFirst({
          where: { name: user.shopName },
          include: {
            products: {
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      }

      if (!shop) {
        shop = await prisma.shop.findFirst({
          include: {
            products: {
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      }

      // If no shop exists at all, auto-create a default shop instance
      if (!shop) {
        shop = await prisma.shop.create({
          data: {
            name: user?.shopName || 'My Retail Store',
            category: user?.shopCategory || 'Kirana',
            address: user?.shopAddress || 'Local Market',
            phone: user?.phone || '+91 9876543210',
            latitude: 28.6139,
            longitude: 77.2090,
            isVerified: true,
            isPromoted: false,
          },
          include: {
            products: true,
          },
        });
      }
    } catch (err) {
      console.error('Error fetching shop instance in inventory GET:', err);
    }

    return NextResponse.json({
      shop: shop || {
        id: 'shop-default-1',
        name: user?.shopName || 'My Retail Store',
        category: user?.shopCategory || 'Kirana',
        address: user?.shopAddress || 'Local Market',
        phone: '+91 9876543210',
      },
      user,
      products: shop?.products || [],
    });
  } catch (error) {
    console.error('Error fetching shopkeeper inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
