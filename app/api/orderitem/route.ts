import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/data/auth';
import client from '@/db';

const prisma = client;

type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    availablequantity: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

type UpdateResult = {
  status: number;
  message: string;
  productId?: number;
  update?: any;
};

type CartItemUpdateResults = UpdateResult[];

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

async function updateProductQuantities(cartItems: CartItem[]): Promise<CartItemUpdateResults> {
  const updateResults: CartItemUpdateResults = [];

  for (const cartItem of cartItems) {
    const productId = cartItem.productId;
    const quantityOrdered = cartItem.quantity;

    const find = await client.product.findUnique({ where: { id: productId } });
    if (!find) {
      updateResults.push({ status: 404, message: "Product not found", productId });
      continue;
    }

    const currentQuantity = find.availablequantity;
    const newQuantity = currentQuantity - quantityOrdered;

    if (newQuantity < 0) {
      updateResults.push({ status: 400, message: `Insufficient quantity for product with ID ${productId}`, productId });
      continue;
    }

    const update = await client.product.update({ where: { id: productId }, data: { availablequantity: newQuantity } });
    updateResults.push({ status: 200, message: "Product updated successfully", update });
  }

  return updateResults;
}





export async function GET(req: NextRequest) {
     try {
       const session = await getServerSession(authOptions);
       const user = await getUser(session);
   
       const orders = await prisma.order.findMany({
         where: {
           userId: user.id,
         },
         include: {
           items: true,
         },
       });
   
       return NextResponse.json({ orders });
     } catch (error) {
       console.error('Error fetching orders:', error);
       return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
     }
   }






export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = await getUser(session);
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const total = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

    const createdOrder = await prisma.order.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        total,
        items: {
          createMany: {
            data: cartItems.map((cartItem) => ({
              productId: cartItem.productId,
              quantity: cartItem.quantity,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const updateResults = await updateProductQuantities(cartItems);

    return NextResponse.json({ message: 'Order placed successfully', order: createdOrder, updateResults });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export default { POST };
