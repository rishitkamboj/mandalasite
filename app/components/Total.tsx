"use client"

import React, { useEffect, useState } from 'react';
import ProductCard from '@/app/components/Product';
import { Spinner } from './Spinner';

const ProductPage = () => {
  const [products, setProducts] = useState<{ id: number; name: string; price: number; image: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts

    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false); // Set loading to false when fetching completes
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false); // Set loading to false on error as well
      });
  }, []);

  return (
    <div className='h-screen'>
    <div className="flex flex-wrap justify-center ">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-gray-700"> <Spinner/></div>
        </div>
       
      ) : (
        products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))
      )}
    </div>
    </div>
  );
};

export default ProductPage;
