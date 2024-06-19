'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AppBar from '../components/AppBar';
import Individual from '../components/CartIndividual';

import axios from 'axios';
import { Spinner } from '../components/Spinner';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface ProductDetails {
  id: number;
  image: string;
  description: string;
  price: number;
}

interface FinalItem extends ProductDetails {
  quantity: number;
}

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [finalItems, setFinalItems] = useState<FinalItem[]>([]);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart');
        const cartItems: CartItem[] = response.data.cartItems;
        setCartItems(cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Set loading to true when fetching product details
      try {
        const productDetailsPromises = cartItems.map(async (item) => {
          const response = await axios.get(`/api/products?id=${item.productId}`);
          const product = response.data[0];
          return {
            ...product,
            quantity: item.quantity,
          };
        });

        const products = await Promise.all(productDetailsPromises);
        setFinalItems(products);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);  // Set loading to false if there are no cart items
    }
  }, [cartItems]);

  const handleDelete = (id: number) => {
    setFinalItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      <AppBar username={session?.user?.name || 'Default Username'} />
      {loading ? (
          <div className='flex items-center justify-center h-screen w-full col-span-full'>
        <Spinner /> </div> // Show the spinner when loading
      ) : (
        finalItems.map((item) => (
          <Individual
            key={item.id}
            id={item.id}
            image={item.image}
            description={item.description}
            quantity={item.quantity}
            price={item.price * item.quantity}
            onDelete={handleDelete}  // Pass the onDelete handler
          />
        ))
      )}
    </div>
  );
};

export default Home;
