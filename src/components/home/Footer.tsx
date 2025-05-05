import Image from "next/image";
import Link from "next/link";

import logo from "@/asserts/lis-pendens-logo-white.png";

import { RiFacebookCircleFill } from "react-icons/ri";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { BsInstagram, BsYoutube } from "react-icons/bs";

export const Footer = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <div className="bg-white text-black">
      <div className="px-6 md:px-2 py-10 lg:px-10 max-w-[1400px] mx-auto">
        {/* Top Section */}
        <section className="mb-2 md:flex justify-between pb-10 md:mb-20">
          <div className="h-[100px] md:mx-10">
            <Link href="/" className="my-auto cursor-pointer text-[20px] font-bold">
              {/* <Image
                src={logo}
                alt="LisPendens brand logo"
                className="w-[120px] h-[36px] md:w-[150px] md:h-[40px]"
                priority
              /> */}

            <span className="text-black  text-[35px] font-extrabold">Lis Pendens  </span>
            <span className="text-green-600 font-extrabold text-[35px]"> Enugu</span>
            </Link>
          </div>

          <div className="text-[20px] md:flex md:justify-between md:w-2/3 lg:w-1/2">
            <div>
              <p className="font-bold mb-4">Quick Links</p>
              <ul className="cursor-pointer font-light text-md">
                <li>Home</li>
                <li>About us</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div className="my-10 md:my-0">
              <p className="font-bold mb-4">Customer Care</p>
              <ul className="cursor-pointer font-light text-md">
                <li>Newsletter</li>
                <li>Support</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4 text-[18px]">Address</p>
              <ul className="cursor-pointer font-light text-md">
                <li>Aguleri Street, Independence Layout, Enugu </li>
                <li>08032453748, 08023243984</li>
                <li>info@judiciary.en.gov.ng</li>
                
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section>
          <div className="cursor-pointer lg:flex justify-between items-center border-t border-white pt-8">
            <div className="flex px-6">
              {[FaTwitter, FaLinkedinIn, RiFacebookCircleFill, BsInstagram, BsYoutube].map((Icon, i) => (
                <span
                  key={i}
                  className="w-[40px] h-[40px] rounded-full border-2 border-white flex items-center justify-center mx-2"
                >
                  <Icon size={20} />
                </span>
              ))}
            </div>
            <div className="mt-6 lg:flex gap-2 md:px-10">
              <div className="flex gap-4">
                <p>Privacy</p>
                <p>Terms</p>
                <p>Cookies</p>
              </div>
              <p className="font-bold mt-4 lg:ml-8 lg:mt-0">
                Copyright © {currentYear}, lis-pendens Inc.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
