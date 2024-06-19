"use client"
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  const handleNavigation = (path:string) => {
    router.push(path);
  };

  return (
    <footer className="bg-white rounded-lg shadow  ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
            <li>
              <a onClick={() => handleNavigation('/about')} className="cursor-pointer hover:underline me-4 md:me-6">About</a>
            </li>

            <li>
              <a onClick={() => handleNavigation('/contact')} className="cursor-pointer hover:underline">Contact</a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center ">© 2024 <a href="https://flowbite.com/" className="hover:underline">MandalaHub™</a>. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
