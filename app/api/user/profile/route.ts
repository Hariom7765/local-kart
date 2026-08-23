import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    // Extract phone from email if phone user format (e.g. +919876543210@localkart.user) or phone attribute
    let user = null;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user && (session.user as any).phone) {
      user = await prisma.user.findUnique({
        where: { phone: (session.user as any).phone },
      });
    }

    if (!user) {
      return NextResponse.json({
        isProfileComplete: false,
        name: session.user.name || '',
        email: session.user.email || null,
        phone: (session.user as any).phone || null,
        role: (session.user as any).role || 'customer',
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, dob, role, shopName, shopCategory, shopAddress } = body;

    if (!name || !dob) {
      return NextResponse.json(
        { error: 'Full Name and Date of Birth are required fields.' },
        { status: 400 }
      );
    }

    const email = session.user.email || null;
    const phone = (session.user as any).phone || (email && email.endsWith('@localkart.user') ? email.split('@')[0] : null);

    // Calculate age if not passed or ensure numeric
    const parsedAge = age ? parseInt(age, 10) : 0;
    const userRole = role === 'shopkeeper' ? 'shopkeeper' : 'customer';

    // Upsert User in database
    let existingUser = null;
    if (email) {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      existingUser = await prisma.user.findUnique({ where: { phone } });
    }

    let updatedUser;

    if (existingUser) {
      updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          age: parsedAge,
          dob,
          role: userRole,
          isProfileComplete: true,
          shopName: userRole === 'shopkeeper' ? shopName : null,
          shopCategory: userRole === 'shopkeeper' ? shopCategory : null,
          shopAddress: userRole === 'shopkeeper' ? shopAddress : null,
        },
      });
    } else {
      updatedUser = await prisma.user.create({
        data: {
          email,
          phone,
          name,
          age: parsedAge,
          dob,
          role: userRole,
          isProfileComplete: true,
          shopName: userRole === 'shopkeeper' ? shopName : null,
          shopCategory: userRole === 'shopkeeper' ? shopCategory : null,
          shopAddress: userRole === 'shopkeeper' ? shopAddress : null,
        },
      });
    }

    // If shopkeeper, automatically create/link a Shop in database if shop details provided
    if (userRole === 'shopkeeper' && shopName && shopCategory && shopAddress) {
      const existingShop = await prisma.shop.findFirst({
        where: { name: shopName },
      });

      if (!existingShop) {
        await prisma.shop.create({
          data: {
            name: shopName,
            category: shopCategory,
            address: shopAddress,
            phone: phone || '+91 9876543210',
            latitude: 28.6139,
            longitude: 77.2090,
            isVerified: true,
            isPromoted: false,
          },
        });
      }
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
