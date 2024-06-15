"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductIn = ({ id, name, description, price, image }: ProductType) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1); // State to manage the selected quantity

  const handleAddToCart = async () => {
    if (!session) {
      alert("Please Sign in to add to cart");
      router.push("/login");
    } else {
      try {
        const res = await axios.put('/api/cart', { productId: id, quantity });
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
    <section className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:-mx-6 lg:flex lg:items-center">
          <img
            className="object-cover object-center lg:w-1/2 lg:mx-6 w-full h-96 rounded-lg lg:h-[36rem]"
            src={image}
            alt=""
          />

          <div className="mt-8 lg:w-1/2 lg:px-6 lg:mt-0">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white lg:text-3xl lg:w-96">
              {name}
            </h1>

            <p className="max-w-lg mt-2 mb-2 text-gray-500 dark:text-gray-400">
              {description}
            </p>

            <h1 className="text-xl mb-2 font-semibold text-gray-800 dark:text-white lg:text-xl lg:w-96">
              Rs.{price}
            </h1>

            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[1, 2, 3].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
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
    </section>
  );
};

export default ProductIn;
