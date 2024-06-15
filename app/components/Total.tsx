"use client"

import React, { use, useEffect, useState } from 'react';
import ProductCard from '@/app/components/Product';
import { Spinner } from './Spinner';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

const ProductPage = () => {
  const router=useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); 

    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
  
        const transformedProducts = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `$${product.price}`,
          href: '#', 
          imageSrc: product.image,
          imageAlt: product.description,
        }));

        setProducts(transformedProducts);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false); 
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {loading ? (
            <div className="flex items-center justify-center h-screen w-full col-span-full">
              <Spinner />
            </div>
          ) : (
            products.map(product => (
              <div onClick={()=>{router.push(`product\/${product.id}`)}}>
              <a key={product.id} href={product.href} className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
              </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
