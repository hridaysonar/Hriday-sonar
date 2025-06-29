import React from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCall, MdOutlineEmail } from "react-icons/md";

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();

        // SweetAlert success message
        // SweetAlert success message after form submission
        Swal.fire({
            title: "🎉 Message Sent Successfully! 🎊🥳",
            text: "Thanks for reaching out! 😎 I'll get back to you soon. 😊✨",
            icon: "success",
            confirmButtonColor: "#2D1251",
            confirmButtonText: "👍 Awesome! 🎯🔥",
        }).then(() => {
            // After the success message, show the rating system
            Swal.fire({
                title: "🌟 Rate My Portfolio! 🌟",
                html: `
            <p class="text-white">How was your experience? 🤔</p>
            <div id="rating-stars" style="font-size: 24px; cursor: pointer;">
                ⭐ ⭐ ⭐ ⭐ ⭐
            </div>
            <p>Let me know your thoughts! 📝</p>
        `,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Submit Review 🚀",
                confirmButtonColor: "#2D1251",
                cancelButtonText: "Cancel ❌",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "🎉 Thank You! 🙌✍️",
                        text: "Your feedback is appreciated! ❤️",
                        icon: "success ✅",
                        confirmButtonColor: "#2D1251",
                    });
                }
            });
        });

        // Clear form fields
        e.target.reset();
    };

    return (
        <div id="contact" className="bg-black flex items-center justify-center pt-20">
            <section className="w-full xl:w-9/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-[25px] boxShadow p-[25px] rounded-xl">

                {/* Left Section - Contact Information */}
                <aside className="w-full bg-black flex flex-col p-[20px] rounded-md">
                    <div className="mb-4">
                        <h1 className="text-[2rem]  leading-[35px] text-white">
                            Let’s Create Something Amazing Together!
                        </h1>
                        <p className="text-[0.9rem] mt-1 text-white pt-4">
                            Have an idea, a question, or just want to say hello? Feel free to reach out!
                            Use the details below or fill out the quick contact form. Let’s bring great ideas to life together!
                        </p>
                    </div>

                    <div className="flex flex-col gap-[10px] text-gray-300">
                        <p className="flex items-center gap-[8px]">
                            <MdOutlineCall />
                            <a href="tel:+01748662245" className="hover:text-white hover:underline   transition-colors">
                                +01748662245
                            </a>
                        </p>
                        <p className="flex items-center break-all gap-[8px]">
                            <MdOutlineEmail />
                            <a href="mailto:mdhridaysonar@gmail.com" className="hover:text-white   hover:underline transition-colors">
                                mdhridaysonar@gmail.com
                            </a>
                        </p>
                        <p className="flex items-center gap-[8px]  ">
                            <IoLocationOutline />
                            Natore ,Bangladesh
                        </p>
                    </div>
                </aside>

                {/* Right Section - Contact Form */}
                <div className="bg-gradient-to-br from-[#33135c] to-[#030303] backdrop-blur-2xl">
                    <form onSubmit={handleSubmit} className="pt-[15px] w-full  p-6 bg-[#00000027] rounded-md backdrop-blur-2xl bg-opacity-80 ">
                        <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                            <div className="flex flex-col gap-[5px] w-full sm:w-[50%]">
                                <label className="text-lg text-gray-300   ">First Name</label>
                                <input
                                    placeholder="Enter Your Name"
                                    type="text"
                                    name="firstName"
                                    required
                                    className="peer border-gray-600 border px-3 py-2 outline-none focus:border-purple-600 w-full text-white transition-colors duration-300 bg-black rounded-md"
                                />
                            </div>

                            <div className="flex flex-col gap-[5px] w-full sm:w-[50%]">
                                <label className="text-lg   text-gray-300">Last Name</label>
                                <input
                                    placeholder="Enter Your Name"
                                    type="text"
                                    name="lastName"
                                    required
                                    className="peer border-gray-600 border px-3 py-2 outline-none focus:border-purple-600 w-full text-white transition-colors duration-300 bg-black rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-[15px] mt-6">
                            <div className="flex flex-col gap-[5px] w-full">
                                <label className="text-lg   text-gray-300">Email Address</label>
                                <input
                                    placeholder="Enter Your Email"
                                    type="email"
                                    name="email"
                                    required
                                    className="peer border-gray-600 border px-3 py-2 outline-none focus:border-purple-600 w-full text-white transition-colors duration-300 bg-black rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[5px] w-full mt-6">
                            <label className="text-lg  text-gray-300">Write Message</label>
                            <textarea
                                placeholder="Enter Your Message"
                                name="message"
                                required
                                className="peer min-h-[100px] border-gray-600 border px-3 py-2 resize-none outline-none w-full text-white transition-colors focus:border-purple-600 duration-300 bg-black rounded-md"
                            ></textarea>
                        </div>

                        <div className="w-full flex items-center sm:items-end justify-center sm:justify-end mt-5">
                            <button
                                type="submit"
                                className="cursor-pointer dark:border-slate-700 py-2.5 px-6 bg-gray-800 border   text-gray-300 transition-all duration-300 hover:border-gray-800  hover:bg-purple-950 hover:text-white  rounded-md text-[1rem] mt-[10px] w-max"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;
