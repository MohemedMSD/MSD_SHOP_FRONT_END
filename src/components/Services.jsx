import React from "react";
import { FaCarSide, FaCheckCircle, FaHeadphonesAlt, FaWallet } from "react-icons/fa";

const Services = () => {
  return (
    <div className="my-12 md:my-16 w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
            <FaCarSide className="text-4xl md:text-5xl text-second" />
            <div className="text-center sm:text-start">
              <h1 className="lg:text-xl font-bold">Free Shipping</h1>
              <h1 className="text-gray-400 text-sm">Free Shipping On All Order</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
            <FaCheckCircle className="text-4xl md:text-5xl text-second" />
            <div className="text-center sm:text-start">
              <h1 className="lg:text-xl font-bold">Safe Money </h1>
              <h1 className="text-gray-400 text-sm">30 Days Money Back</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col sm:-translate-x-2 lg:translate-x-0 items-center justify-center sm:flex-row gap-4">
            <FaWallet className="text-4xl md:text-5xl text-second" />
            <div className="text-center sm:text-start">
              <h1 className="lg:text-xl font-bold">Secure Payment</h1>
              <h1 className="text-gray-400 text-sm">All Payment Secure</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
            <FaHeadphonesAlt className="text-4xl md:text-5xl text-second" />
            <div className="text-center sm:text-start">
              <h1 className="lg:text-xl font-bold">Online Supoort 24/7</h1>
              <h1 className="text-gray-400 text-sm">Technical Support 24/7</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
