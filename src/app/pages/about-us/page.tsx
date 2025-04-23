// components/about-us/AboutUs.tsx
"use client"
import NavBar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import { Footer } from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/asserts/about-us-hero-img.jpg"; // adjust path if needed

const AboutUs = () => {
  return (
    <div id="about-us-page">
      <div className="max-w-[1100px] px-4 mx-auto">
        {/* ======Navbar component========= */}
        <section>
          <NavBar bgColor="none" backdropBlur="blur(10px)" />
        </section>

        {/* ====== Main Content ====== */}
        <section className="pt-20 md:pt-32 font-Avenir">
          {/* ====== Hero image ====== */}
          <motion.div
            initial={{ x: "-50vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", duration: 5, delay: 0 }}
            className="h-[4rem] sm:h-[6.5rem] md:h-[9.125rem] w-full bg-[#C4C4C4] rounded-[0.4rem] sm:rounded-[0.75rem] md:rounded-[1.125rem] overflow-hidden relative"
          >
            <Image
              src={heroImg}
              alt="About page hero image"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>

          <motion.div
            initial={{ x: "50vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", duration: 5, delay: 0 }}
          >
            {/* ====== Title ====== */}
            <h1 className="my-[1.7rem] sm:my-[2.2rem] md:my-[2.75rem] font-extrabold text-[1.3rem] sm:text-[1.5rem] md:text-[2.125rem] font-Avenir">
              About us
            </h1>

            {/* ====== Body Content ====== */}
            <section className="w-full text-[0.7rem] sm:text-[0.85rem] md:text-[1.125rem]">
              <p className="font-medium">
                e-Lis Pendens is a platform that helps you find out if a property you are interested in has any encumbrance or ongoing lawsuit on it...
              </p>

              <p className="font-black my-3 sm:my-4 md:my-6">
                Why do you need e-Lis Pendens?
              </p>
              <p className="font-medium">
                Buying or selling a property is a major decision that involves a lot of money and risk...
              </p>

              <p className="font-black my-3 sm:my-4 md:my-6">
                How does e-Lis Pendens work?
              </p>
              <p className="font-medium">
                e-Lis Pendens is a simple and convenient way to access the information of any lawsuit-encumbered property...
              </p>
              <ul className="font-black my-3 sm:my-4 md:my-6 list-disc pl-4">
                <li>
                  The encumbrances and the lawsuits that affect the property, along with their details and status
                </li>
              </ul>
              <p className="font-medium">
                e-Lis Pendens is powered by a reliable and updated database...
              </p>

              <p className="font-black my-3 sm:my-4 md:my-6">
                Who are we?
              </p>
              <p className="font-medium mb-2">
                e-Lis Pendens is supported by a team of professionals passionate about real estate and technology...
              </p>
            </section>

            {/* ====== Contact button ====== */}
            <Link href="/contact-us">
              <button className="bg-[#000000] hover:bg-[#000000]/90 text-white w-[7rem] sm:w-[8.5rem] md:w-[10.938rem] h-[2rem] sm:h-[2.3rem] md:h-[2.813rem] border-none rounded-[0.7rem] sm:rounded-[0.85rem] md:rounded-2xl my-[2rem] sm:my-[3rem] md:my-[4.125rem] text-[0.8rem] sm:text-[0.85rem] md:text-[0.95rem]">
                Contact us
              </button>
            </Link>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
