"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      console.log(data);
      
      if (data) {
        alert("Email has been sent to the email address provided. Please verify your email address to continue.");
        router.push("/api/auth/signin");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center backg">
        <div className="text-2xl font-bold">Name is under process HEHE</div>
      </div>
      <div className="flex items-center justify-center bg-slate-100">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
          <p className="text-sm text-center mb-6">Already signed up? <a href="/api/auth/signin" className="text-blue-500 hover:underline"><span className='grad'> Login</span></a></p>
          
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white btn-grad"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
