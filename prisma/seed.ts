import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Local Cart AI database...');

  // Clean existing data
  await prisma.product.deleteMany({});
  await prisma.shop.deleteMany({});

  // 1. Laxmi Kirana & Super Store
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Laxmi Kirana & Super Store',
      category: 'Kirana',
      address: '42 Main Market, Connaught Place, New Delhi',
      phone: '+91 9876543210',
      latitude: 28.6315,
      longitude: 77.2167,
      isVerified: true,
      isPromoted: true,
      products: {
        create: [
          {
            name: 'Aashirvaad Whole Wheat Atta 5kg',
            category: 'Kirana',
            price: 245.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Fortune Kachi Ghani Mustard Oil 1L',
            category: 'Kirana',
            price: 155.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Amul Taaza Toned Fresh Milk 1L',
            category: 'Kirana',
            price: 54.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Tata Vacuum Salt 1kg Pack',
            category: 'Kirana',
            price: 28.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1518110168401-f2877ee2c088?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Maggi 2-Minute Masala Noodles (4 Pack)',
            category: 'Kirana',
            price: 56.0,
            inStock: false,
            imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
  });

  // 2. Apollo Meds Local Branch
  const shop2 = await prisma.shop.create({
    data: {
      name: 'Apollo Meds Local Branch',
      category: 'Medical',
      address: 'Shop 14, Sector 18 Market, Noida',
      phone: '+91 9811223344',
      latitude: 28.5708,
      longitude: 77.3261,
      isVerified: true,
      isPromoted: true,
      products: {
        create: [
          {
            name: 'Dettol Antiseptic Liquid 250ml',
            category: 'Medical',
            price: 120.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Vicks Vaporub 50g Relief Balm',
            category: 'Medical',
            price: 165.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Volini Instant Pain Relief Spray 100g',
            category: 'Medical',
            price: 290.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Digital LCD Fever Thermometer',
            category: 'Medical',
            price: 249.0,
            inStock: false,
            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
  });

  // 3. Sharma Electronics & Mobiles
  const shop3 = await prisma.shop.create({
    data: {
      name: 'Sharma Electronics & Mobiles',
      category: 'Electronics',
      address: '108 Nehru Place Computer Market, New Delhi',
      phone: '+91 9988776655',
      latitude: 28.5494,
      longitude: 77.252,
      isVerified: true,
      isPromoted: false,
      products: {
        create: [
          {
            name: 'boAt Airdopes 141 True Wireless Earbuds',
            category: 'Electronics',
            price: 1299.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Fastrack Limitless Smart Watch',
            category: 'Electronics',
            price: 1999.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'SanDisk Ultra 64GB USB 3.0 Flash Drive',
            category: 'Electronics',
            price: 499.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Braided Type-C Fast Charging Cable 1.5m',
            category: 'Electronics',
            price: 299.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
  });

  // 4. Vijay Garments & Fashion
  const shop4 = await prisma.shop.create({
    data: {
      name: 'Vijay Garments & Fashion',
      category: 'Fashion',
      address: '88 Commercial Street, Bengaluru',
      phone: '+91 9741002288',
      latitude: 12.9822,
      longitude: 77.6083,
      isVerified: false,
      isPromoted: false,
      products: {
        create: [
          {
            name: "Men's Stretchable Slim Fit Denim Jeans",
            category: 'Fashion',
            price: 1199.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Pure Cotton Ethnic White Kurta for Men',
            category: 'Fashion',
            price: 899.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: "Women's Floral Print Summer Dress",
            category: 'Fashion',
            price: 1499.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
  });

  // 5. Shree Ganesh Provisions
  const shop5 = await prisma.shop.create({
    data: {
      name: 'Shree Ganesh Provisions',
      category: 'Kirana',
      address: '15 Indiranagar 100ft Road, Bengaluru',
      phone: '+91 9845012345',
      latitude: 12.9784,
      longitude: 77.6408,
      isVerified: true,
      isPromoted: false,
      products: {
        create: [
          {
            name: 'Organic Unpolished Toor Dal 1kg',
            category: 'Kirana',
            price: 175.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Fortune Everyday Basmati Rice 5kg',
            category: 'Kirana',
            price: 499.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
          },
          {
            name: 'Taj Mahal Premium Tea 500g Pack',
            category: 'Kirana',
            price: 360.0,
            inStock: true,
            imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    },
  });

  console.log(`Seeding complete! Seeded ${[shop1, shop2, shop3, shop4, shop5].length} shops with items.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
