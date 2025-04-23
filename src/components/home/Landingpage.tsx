"use client";

import NavBar from "@/components/home/Navbar";
import Button from "@/components/utils/Button";
import Link from "next/link";
import { FiInfo } from "react-icons/fi";
import { BsCheckCircle, } from "react-icons/bs";
import { HiArrowNarrowRight } from 'react-icons/hi';
import SearchButton from "@/components/utils/SearchButton";
import { Footer } from "@/components/home/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import Joyride from "react-joyride";
import home3 from "@/asserts/home-img-3.png"
import Image from "next/image";
import home12 from "@/asserts/home-img-12.jpg"

const LandingPage = () => {
  const [runTour] = useState(true);
  const MotionImage = motion(Image);

  return (
    <div>
      <Joyride
        steps={[
          { target: ".tour-0", content: "This is the first tour step!", disableBeacon: false },
          { target: ".tour-1", content: "This is the second tour step!", disableBeacon: false },
          { target: ".tour-2", content: "This is the third tour step!", disableBeacon: false },
          { target: ".tour-3", content: "This is the fourth tour step!", disableBeacon: false },
          { target: ".tour-4", content: "This is the fifth tour step!", disableBeacon: false },
          { target: ".tour-5", content: "This is the sixth tour step!", disableBeacon: false },
          { target: ".tour-6", content: "This is the seventh tour step!", disableBeacon: false },
          { target: ".tour-7", content: "This is the eighth tour step!", disableBeacon: false },
        ]}
        continuous={true}
        run={runTour}
        showProgress={true}
        showSkipButton={true}
        styles={{ options: { zIndex: 10000 } }}
      />

      <div id="home-page-container">
        <div className="max-w-[1100px] mx-auto h-full flex flex-col ">
          {/* ====== Navbar Section ====== */}
          <section>
            <NavBar bgColor="none" backdropBlur="blur(10px)" />
          </section>

          {/* ====== Hero Section ====== */}
          <section className="pt-20 sm:pt-32 flex flex-col items-center h-full px-[10px] md:px-[20px] font-Avenir">
            {/* ====== Section 1 ====== */}
            <div className="w-full relative">
              <motion.div
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 5 }}
                className=" tour-0 bg-white/[0.6] w-[100%] sm:w-[75%] max-w-[45.375rem] mx-auto sm:mx-0 p-[1rem] rounded-lg sm:rounded-[1.125rem] sm:absolute z-10 sm:top-[1.938rem]"
              >
                <h1 className="font-extrabold text-[1rem] sm:text-[1.75rem] md:text-[2.375rem] whitespace-pre-line">
                  Ensure your property{"\n"}is litigation-free.
                </h1>
                <p className="border-l-2 border-[#000] pl-[0.4rem] sm:pl-[0.625rem] py-[0.4rem] sm:py-[0.625rem] font-normal text-[0.65rem] sm:text-[1.25rem] mt-[0.75rem] sm:mt-[1.125rem] mb-[2rem] sm:mb-[3.9rem]">
                  Get an official Search Report.
                </p>
                <div className="cursor-pointer">
                <Link href="/pages/search ">
                  <SearchButton   />
                </Link>
                </div>
              </motion.div>

              {/* ====== Hero Video ====== */}
              <motion.div
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 5 }}
                className="my-6 sm:my-0 flex justify-center sm:justify-end"
              >
                <video
                  autoPlay
                  playsInline
                  loop
                  muted
                  className="h-[11.5rem] sm:h-[26rem] md:h-[32.625rem] w-[10rem] sm:w-[19rem] md:w-[31.25rem] rounded-lg sm:rounded-2xl object-cover"
                >
                  <source src="/home-hero-video.mp4" type="video/mp4" />
                </video>
              </motion.div>

              {/* ====== Testimonial Section ====== */}
              <motion.div
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 5 }}
                className="sm:absolute sm:bottom-[-4%] md:bottom-[-6.5%]"
              >
                <div className="flex">
                  <motion.div
                    initial={{ y: "100vw" }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", duration: 5 }}
                    className="h-[3rem] sm:h-[3.5rem] w-[3rem] sm:w-[3.5rem] mr-[0.55rem]"
                  >
                    <img
                      src="/home-avatar-img-3.svg"
                      alt="user review avatar"
                      className="h-[2rem] sm:h-[2.3rem] md:h-[2.5rem] w-[2rem] sm:w-[2.3rem] md:w-[2.5rem] rounded-full object-cover"
                    />
                  </motion.div>
                  <div className="tour-1 sm:max-w-[66%]">
                    <p className="font-light text-[0.8rem] sm:text-[0.9rem] md:text-[1.25rem] max-w-[65%] whitespace-pre-line">
                      &quot;The best part about using Lis Pendens is that it is
                      an unbiased platform focused on providing the right,
                      up-to-date information on a property’s legal status.&quot;
                    </p>
                    <p className="font-extrabold text-[0.8rem] sm:text-[0.9rem] md:text-[1.25rem]">
                      Hon. Justice Yusuf Anka
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>



            {/* ====== Section 2 ====== */}
            <div className="w-full flex flex-col justify-center mt-[5rem] sm:mt-[10rem] md:mt-[13.688rem] mb-[4rem] sm:mb-[7rem] md:mb-[9.563rem]">
              <motion.p
                initial={{ x: "100vw" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", duration: 5 }}
                className="tour-2 sm:whitespace-pre-line text-center font-extrabold text-[1rem] sm:text-[1.23rem] md:text-[2rem]"
              >
                e-Lis Pendens is a simple and convenient way to access{"\n"}
                the information of any lawsuit-encumbered property.
              </motion.p>

              <Link href="/pages/about-us">
                <button className="tour-3 mt-4 bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-all flex items-center gap-2">
                  <FiInfo className="text-lg" />
                  Learn More
                </button>
              </Link>


              <div>
                <Image
                  src={home12}
                  alt="Home page image-2"
                  className="w-full h-[6rem] sm:h-[10rem] md:h-[18.375rem] rounded-[0.5rem] sm:rounded-[0.75rem] md:rounded-[1rem] mt-[2.5rem] sm:mt-[3.75rem] md:mt-[5.938rem] object-cover"
                />
              </div>

              <div className="flex w-full justify-around mt-[1.7rem] sm:mt-[2.3rem] md:mt-[3.125rem]">
                <div className="flex items-center">
                  <BsCheckCircle size={8} />
                  <p className="tour-4 font-medium text-[0.75rem] sm:text-[1rem] md:text-[1.25rem] ml-1 sm:ml-[0.938rem]">
                    Safe & Secured
                  </p>
                </div>

                <div className="tour-5 flex items-center">
                  <BsCheckCircle  size={8} />
                  <p className="tour-5 font-medium text-[0.75rem] sm:text-[1rem] md:text-[1.25rem] ml-1 sm:ml-[0.938rem]">
                    Timely & Efficient
                  </p>
                </div>

                <div className="flex items-center">
                  <BsCheckCircle size={8} />
                  <p className="tour-6 font-medium text-[0.75rem] sm:text-[1rem] md:text-[1.25rem] ml-1 sm:ml-[0.938rem]">
                    Accurate & Reliable
                  </p>
                </div>
              </div>

              {/* Example usage of BsCheckCircle */}
              <div className="tour-4 mt-6 flex items-center justify-center gap-2 text-green-600">
                <BsCheckCircle className="text-2xl" />
                <span className="text-sm sm:text-base font-medium">Verified legal status</span>
              </div>
            </div>

            <div className="relative w-full mb-[4rem] sm:mb-[6rem] md:mb-[10.313rem]">
              {/* Contact card */}
              <div>
                <motion.div
                  initial={{ x: "-100vw" }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", duration: 5, delay: 0 }}
                  className="bg-white/[0.6] w-[100%] sm:w-[60%] max-w-[33.688rem] mx-auto sm:mx-0 p-[1rem] sm:p-[1.5rem] md:p-[1.875rem] mb-[2rem] sm:mb-0 rounded-[0.7rem] sm:rounded-[1.125rem] sm:absolute z-[90]  sm:top-[1.75rem]"
                >
                  <p className="font-extrabold text-[0.9rem] sm:text-[1.2rem] md:text-[1.5rem] mb-[1.5rem] sm:mb-[2.2rem] md:mb-[2.875rem] sm:max-w-[85%] md:max-w-[90%]">
                    e-Lis Pendens is powered by a reliable and updated database
                    that collects and verifies information from various sources.
                  </p>
                  <Link href="/contact-us">
                    <Button>Contact us</Button>
                  </Link>
                </motion.div>
              </div>

              <div className="sm:flex sm:justify-end">
              <MotionImage
  initial={{ x: "100vw" }}
  animate={{ x: 0 }}
  transition={{ type: "spring", duration: 5, delay: 0 }}
  src={home3}
  alt="Home page image-3"
  className="rounded-[0.7rem] sm:rounded-[1.125rem] w-[100%] sm:w-[30rem] md:w-[45.063rem] sm:h-[20rem] md:h-[24.438rem] sm:justify-self-end object-cover"
/>
              </div>
            </div>



          </section>

          <div className=" bg-gray-400 flex flex-col sm:flex-row items-center sm:justify-center gap-[0.6rem] sm:gap-[1.8rem] md:gap-[2.625rem] py-[1rem] sm:py-[1.75rem] md:py-[2.75rem]">
        <p className="text-center font-medium text-[0.8rem] sm:text-[1.15rem] md:text-[1.625rem]">
          For further enquires and more informations
        </p>
        <Link href="/faq">
          <button className="bg-[#000] text-[#FFF] font-medium text-[0.8rem] sm:text-[0.9rem] md:text-[1.063rem] w-[5rem] sm:w-[6rem] md:w-[7.875rem] h-[1.75rem] sm:h-[2.35rem] md:h-[2.5rem] border-none rounded-[0.7rem] sm:rounded-[0.9rem] md:rounded-[1rem]">
            FAQ
          </button>
        </Link>
      </div>

          {/* ====== Footer ====== */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
