"use client";

import NavBar from "@/components/home/Navbar";
import { MdLocationOn } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import image at the top
import authBg from "@/asserts/auth-bg.png";

const ContactUs = () => {
  const form = useRef<HTMLFormElement>(null);

  function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.current) {
      toast.error("Form is not available.");
      return;
    }
    emailjs
      .sendForm(
        "service_j9ymt04",
        "template_9b7t84i",
        form.current,
        "b85Jl3R5SfRDirFR-"
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
        },
        (err) => {
          toast.error(
            err?.response?.data?.message || "Failed to send message."
          );
        }
      );
  }

  return (
    <>
      <div
        id="contact-page"
        className="flex items-center justify-center min-h-[100vh] bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="max-w-[1100px] px-4 mx-auto">
          {/* ====== Navbar component ====== */}
          <section>
            <NavBar bgColor="none" backdropBlur="blur(10px)" />
          </section>

          {/* ====== Main content ====== */}
          <section className="pt-20 sm:pt-32 font-Chillax px-2">
            <div className="flex flex-col-reverse sm:flex-row gap-10 items-center w-full">
              {/* ====== Address section ====== */}
              <div className="bg-[#ebeef5] rounded-md p-3 sm:p-0 sm:bg-[#ebeef5]/0">
                <div className="flex items-center bg-[#ebeef5] gap-2 sm:gap-6 sm:p-2 sm:rounded-md max-w-[90%]">
                  <div className="w-[1.7rem] h-[1.7rem] sm:w-[3rem] sm:h-[3rem] rounded-full bg-white flex items-center justify-center">
                    <MdLocationOn size={22} />
                  </div>
                  <p className="max-w-[90%] sm:max-w-[65%]">
                    {" "}
                    Anambra State judiciary headquarters, Awkau{" "}
                  </p>
                </div>

                <div className="flex items-center bg-[#ebeef5] gap-2 sm:gap-6 sm:p-2 sm:rounded-md my-2 sm:my-14 max-w-[90%]">
                  <div className="w-[1.7rem] h-[1.7rem] sm:w-[3rem] sm:h-[3rem] rounded-full bg-white flex items-center justify-center">
                    <FaPhone />
                  </div>
                  <p>+234 8065897854</p>
                </div>

                <div className="flex items-center bg-[#ebeef5] gap-2 sm:gap-6 sm:p-2 sm:rounded-md max-w-[90%]">
                  <div className="w-[1.7rem] h-[1.7rem] sm:w-[3rem] sm:h-[3rem] rounded-full bg-white flex items-center justify-center">
                    <MdOutlineMailOutline size={22} />
                  </div>
                  <p> info@anambrajudiciary.an.gov.ng</p>
                </div>
              </div>

              {/* ====== Contact form ====== */}
              <form ref={form} onSubmit={sendEmail}>
                <div className="bg-[#ebeef5] px-6 py-4 max-w-[480px] rounded-2xl shadow-2xl mb-2 md:mt-4 md:mb-8 lg:w-[24rem]">
                  <p className="text-lg md:text-xl font-semibold mb-4">
                    Send message
                  </p>

                  <div className="space-y-4">
                    <div className="mt-4">
                      <label className="text-xs md:text-sm">Name</label>
                      <input
                        type="text"
                        name="from_name"
                        className="bg-[#ebeef5] block h-[1.9rem] max-w-[480px] w-full px-2 py-1 border border-solid border-[#BFBFBF] rounded-[0.3rem]"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-xs md:text-sm">Email</label>
                      <input
                        type="text"
                        name="from_email"
                        className="bg-[#ebeef5] block h-[1.9rem] max-w-[480px] w-full px-2 py-1 border border-solid border-[#BFBFBF] rounded-[0.3rem]"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-xs md:text-sm">Message</label>
                      <textarea
                        name="message"
                        className="bg-[#ebeef5] block w-full px-2 py-1 border border-solid border-[#BFBFBF] rounded-[0.3rem]"
                        rows={6}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-[#000] text-[#FFF] shadow-xl font-semibold text-[0.85rem] px-2 py-2 rounded-[0.45rem] sm:text-[1rem] sm:px-[2rem] sm:py-[0.5rem] md:text-[1rem] md:px-[2rem] md:py-[0.625rem] md:rounded-[0.65rem] lg:px-[2rem] lg:py-[0.35rem] lg:rounded-[0.75rem]"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ContactUs;
