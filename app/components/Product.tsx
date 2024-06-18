"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ProductType {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, name, price, image }: ProductType) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = async (productId: number) => {
    if (!session) {
      alert("Please Sign in to add to cart");
      router.push("/login");
    } else {
      try {
        const res = await axios.put('/api/cart', { productId, quantity: 1 });
        if (res.status === 200) {
          alert("Added to cart");
        } else {
          alert("Some error occurred");
        }
      } catch (error) {
        alert("Some error occurred");
      }
    }
  };

  return (
    
    <div className="flex flex-col w-full max-w-xs bg-white rounded-lg border border-gray-100 shadow-md m-2">
      <a href="#" className="block relative overflow-hidden">
        <img className="object-cover w-full h-48" src={image} alt={name} />
        <span className="absolute top-0 left-0 m-2 px-2 py-1 rounded bg-black text-white text-xs font-medium">
          {Math.round(Math.random() * 50)}% OFF
        </span>
      </a>
      <div className="px-4 py-2">
        <a href="#" className="block mt-2 font-semibold text-gray-900 hover:text-gray-700">
          <h3 className="text-lg">{name}</h3>
        </a>
        <p className="mt-2 text-gray-700">{/* Add product description here */}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-900 font-bold">Rs.{price}</p>
          <button
            onClick={() => handleAddToCart(id)}
            className="flex items-center justify-center bg-slate-900 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.939 6.939l-1.879 1.88v1.414l1.879 1.88-1.414 1.415-1.88-1.88-1.879 1.88-1.415-1.415 1.88-1.88-1.88-1.879 1.415-1.415 1.88 1.88v-1.414l-1.88-1.88 1.415-1.415 1.88 1.88 1.879-1.88 1.414 1.415zm-9.268 7.1a2 2 0 100-2.828 2 2 0 000 2.828z"
                clipRule="evenodd"
              />
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
