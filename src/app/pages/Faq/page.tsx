"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

import NavBar from "@/components/home/Navbar"; // Next.js style absolute import
import { faqData } from "@/components/utils/Linkdata"; // Assumes faqData is properly exported

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const Faq = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <Suspense fallback={<div>Loading FAQs...</div>}>
      <div id="faq-page">
        <div className="max-w-[1100px] px-4 mx-auto">
          {/* ======Navbar component========= */}
          <section>
            <NavBar bgColor="none" backdropBlur="blur(10px)" />
          </section>

          {/* ====== MainContent goes here ..... =========== */}
          <section className="flex flex-col justify-center pt-20 md:pt-32 font-Chillax">
            <div className="w-[89%] max-w-[1400px] bg-[#FFF] m-auto p-8 rounded-lg shadow-md">
              <h2 className="sm:text-xl md:text-2xl mb-6 font-semibold">
                Frequently Asked Questions
              </h2>

              {faqData.map((faq: FaqItem) => (
                <motion.div
                  key={faq.id}
                  initial={{ x: faq.id % 2 === 0 ? "2vw" : "-2vw" }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", duration: 10, delay: 0 }}
                  className="mb-4 last:mb-0"
                >
                  <button
                    id="faq-item"
                    className="w-full text-left text-[0.7rem] sm:text-[1rem] md:text-[1.4rem] focus:outline-none p-4 rounded-lg shadow sm:shadow-md flex flex-col"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="w-full flex justify-between">
                      <p className="max-w-[85%] font-semibold">{faq.question}</p>
                      {activeFaq === faq.id ? <FaMinusCircle /> : <FaPlusCircle />}
                    </div>
                    {activeFaq === faq.id && (
                      <motion.div
                        className="mt-3 text-[0.65rem] sm:text-[0.85rem] md:text-[1rem]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* ====== Disclaimer section ====== */}
            <div className="w-[89%] max-w-[1400px] bg-[#000] mx-auto px-4 py-1 rounded-lg shadow-md mt-12 mb-6">
              <h3 className="text-[#FFF] font-bold italic text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem]">
                Disclaimer:
              </h3>
              <p className="text-[#FFF] italic text-[0.65rem] sm:text-[0.7rem] md:text-[0.75rem]">
                The information provided by Enugu e-Lis Pendens is for informational
                purposes only and should not be considered a substitute for legal
                advice.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Suspense>
  );
};

export default Faq;
