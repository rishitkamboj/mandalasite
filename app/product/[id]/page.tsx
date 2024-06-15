"use client"
import ProductCard from '@/app/components/Product';
import { Spinner } from '@/app/components/Spinner';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import AppBarNotLoggedIn from '@/app/components/AppBarNotLoggedIn';
import Footer from '@/app/components/Footer';
import AppBar from '@/app/components/AppBar';
import ProductIn from '@/app/components/ProductIn';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  params: { id: string };
}

export default function ProductPage({ params }: Props) {
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const url = `/api/products`;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const foundProduct = data.find((p: Product) => p.id === parseInt(params.id));
        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div>
        {status === "authenticated" ? <AppBar username={session?.user?.name || 'Default Username'} /> : <AppBarNotLoggedIn />}
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-gray-700">
            <Spinner />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        {status === "authenticated" ? <AppBar username={session?.user?.name || 'Default Username'} /> : <AppBarNotLoggedIn />}
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-gray-700">Product not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {status === "authenticated" ? <AppBar username={session?.user?.name || 'Default Username'} /> : <AppBarNotLoggedIn />}
    
      <ProductIn id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} />
      <Footer />
    </div>
  );
}
