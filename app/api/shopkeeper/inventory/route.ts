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

    const email = session.user.email;
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    // Find or locate shop associated with this user
    let shop = null;
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

    // Fallback: If no shop found by shopName, grab first shop or return default shop container
    if (!shop) {
      const firstShop = await prisma.shop.findFirst({
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      shop = firstShop;
    }

    return NextResponse.json({
      shop,
      user,
      products: shop?.products || [],
    });
  } catch (error) {
    console.error('Error fetching shopkeeper inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
