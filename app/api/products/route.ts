import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        shop: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopId, name, category, price, inStock, stockQuantity, description, imageUrl } = body;

    if (!shopId || !name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'shopId, name, category, and price are required' },
        { status: 400 }
      );
    }

    const parsedStock = stockQuantity !== undefined ? parseInt(stockQuantity, 10) : 10;
    const isStockAvailable = inStock !== undefined ? Boolean(inStock) : parsedStock > 0;

    const newProduct = await prisma.product.create({
      data: {
        shopId,
        name,
        category,
        price: parseFloat(price),
        inStock: isStockAvailable,
        stockQuantity: parsedStock,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
