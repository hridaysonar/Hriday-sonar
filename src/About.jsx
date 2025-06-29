import { BorderBeam } from '@stianlarsen/border-beam';
import Contact from './Contact';
import Footer from './Footer';
import Skill from './Skill';
import Works from './Works';
import imgy from '../public/img/hriday.jpg'
import { FaArrowRight } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

// Try to import the image; fallback if it fails
let hriday;
try {
  hriday = require('./assets/rizon-ahmed-removebg.png');
} catch {
  hriday = 'https://via.placeholder.com/300x300.png?text=Image+Not+Found';
}

const About = () => {
  return (
    <div id='about'>
      <div className="flex items-center justify-center pt-14 pb-14 bg-black text-white mt-20 px-8">
        <div className="container mx-auto lg:w-10/12 xl:w-9/12 flex flex-col-reverse md:flex-row items-center space-y-4 md:space-y-0 md:space-x-10">

          {/* Text Section */}
          <div className="text-center md:text-left pl-4">
            <p className="text-lg mt-8">Hello there 👋</p>
            <h1 className="text-4xl text-purple-500 lg:mt-4">I'm Hriday</h1>
            <p className="text-gray-300 text-left mt-3 xl:w-11/12">
              A <span className="text-purple-500 font-semibold">FrontEnd Developer & MERN Stack Specialist.</span> I'm deeply passionate about creating innovative, responsive, and user-friendly web applications that captivate and engage users...
            </p>

            <button className="mt-8 px-10 py-3 flex items-center gap-2 cursor-pointer hover:bg-purple-500 text-gray-300 border-b border-purple-800 hover:text-white rounded-full transition">
              <a href="mailto:mdhridaysonar@gmail.com" target='_blank' rel='noopener noreferrer'>Hire Me</a>
              <FaArrowRight />
            </button>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="w-48 h-48 md:w-80 md:h-80 rounded-full flex items-center justify-center overflow-hidden">
              <img src={imgy} alt="hriday" className="w-full h-full object-cover" />
              <BorderBeam size={250} borderWidth={2} duration={10} colorFrom={'#BBDEFB'} colorTo={'#0000CD'} />
            </div>
          </div>

        </div>
      </div>

      <Skill />
      <Works />

      <div className='bg-black pb-10'>
        <div className="md:w-9/12 mx-auto py-10 p-6 text-white rounded-lg shadow-lg overflow-hidden">
          <p className='text-xl pb-5 text-2xl sm:text-3xl md:text-4xl text-center mb-8'>
            !! <span style={{ color: '#BB86FC' }}>
              <Typewriter
                words={['What I Like To Do 😍', 'What I lOve To Do 💕', 'What Service I Provide 🎶', 'My Hobby 😎', 'My profession 😒']}
                loop={Infinity}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </p>

          {/* Scrolling Section */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4 animate-scroll">
              {Array(2).fill([
                { icon: "🖥️", title: "Build Full Website", desc: "I will design and redesign any type of website with a modern and clean UI." },
                { icon: "⚙️", title: "Maintenance & Optimization", desc: "I can optimize your website for better speed and maintain its performance." },
                { icon: "🎨", title: "Unique Design", desc: "I provide a creative and unique UI/UX design that stands out." },
                { icon: "📱", title: "Responsive Layout", desc: "Ensuring your website is fully responsive on all devices." },
                { icon: "🛒", title: "E-Commerce Store", desc: "Creating fully functional online stores with seamless payment integration." },
                { icon: "🐞", title: "Bug Fixing", desc: "Fixing all kinds of bugs and performance issues for a smooth experience." },
                { icon: "🚀", title: "Performance Optimization", desc: "Boost website speed and improve SEO rankings." },
                { icon: "🛠️", title: "Custom Web Apps", desc: "Developing custom web applications with advanced features." },
                { icon: "📊", title: "Dashboard & Analytics", desc: "Creating user-friendly dashboards to track data & insights." },
                { icon: "🔒", title: "Security Enhancement", desc: "Implementing security measures to protect from cyber threats." },
              ]).flat().map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-4 py-10 rounded-lg shadow-md min-w-[100px] text-center border border-purple-500 transition-transform transform hover:scale-110 hover:shadow-white"
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <h3 className="text-md font-bold text-purple-400 whitespace-nowrap overflow-hidden text-ellipsis">
                    {service.icon} {service.title}
                  </h3>
                  <p className="text-xs w-8/12 text-center mx-auto text-gray-300 whitespace-normal">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Contact />
      <Footer />
    </div>
  );
};

export default About;
