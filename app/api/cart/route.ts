import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/data/auth';
import client from '@/db';

const prisma = client;

async function getUser(session: any) {
  if (!session || !session.user || !session.user.email) {
    throw new Error('User not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = await getUser(session);
    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ message: 'Product ID and quantity are required' }, { status: 400 });
    }

    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Product added to cart successfully', cartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = await getUser(session);
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const cartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json({ message: 'Product not found in cart' }, { status: 404 });
    }

    await prisma.cart.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export default { GET, PUT,DELETE};
