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
    let { shopId, name, category, price, inStock, stockQuantity, description, imageUrl, shopName, shopAddress, shopPhone } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Product name, category, and price are required fields.' },
        { status: 400 }
      );
    }

    // Auto-resolve or create shop if shopId is missing or invalid
    let validShopId = shopId;
    if (validShopId) {
      const existing = await prisma.shop.findUnique({ where: { id: validShopId } });
      if (!existing) validShopId = null;
    }

    if (!validShopId) {
      // Find any shop by shopName or grab first shop
      let targetShop = null;
      if (shopName) {
        targetShop = await prisma.shop.findFirst({ where: { name: shopName } });
      }
      if (!targetShop) {
        targetShop = await prisma.shop.findFirst();
      }

      if (!targetShop) {
        // Automatically create a default shop instance
        targetShop = await prisma.shop.create({
          data: {
            name: shopName || 'My Retail Store',
            category: category || 'Kirana',
            address: shopAddress || 'Local Market',
            phone: shopPhone || '+91 9876543210',
            latitude: 28.6139,
            longitude: 77.2090,
            isVerified: true,
            isPromoted: false,
          },
        });
      }
      validShopId = targetShop.id;
    }

    const parsedStock = stockQuantity !== undefined && stockQuantity !== null ? parseInt(String(stockQuantity), 10) : 10;
    const isStockAvailable = inStock !== undefined ? Boolean(inStock) : (isNaN(parsedStock) ? 10 : parsedStock) > 0;

    const newProduct = await prisma.product.create({
      data: {
        shopId: validShopId,
        name: String(name).trim(),
        category: String(category).trim(),
        price: parseFloat(String(price)),
        inStock: isStockAvailable,
        stockQuantity: isNaN(parsedStock) ? 10 : parsedStock,
        description: description ? String(description).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
