import { BorderBeam } from '@stianlarsen/border-beam';
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white  fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto xl:w-9/12 flex justify-between items-center bg-gray-900 px-6 py-5 rounded-2xl backdrop-blur-xl sticky  top-0">
        
        {/* Left Side - Menu Items (For Large Screens) */}
        <ul className="hidden md:flex gap-6 text-lg">
          <li>
            <a href="#about" className="block px-4 border-b border-purple-600  py-2 rounded-full hover:bg-[#7A34F2] transition ">
              About            </a>
            
          </li>
          <li>
            <a href="#skill" className="block px-4 py-2 border-b border-purple-600 rounded-full hover:bg-[#7A34F2] transition ">
              Skills
              
            </a>
          </li>
          <li>
            <a href="#work" className="block px-4 py-2 border-b border-purple-600 rounded-full hover:bg-[#7A34F2] transition  ">
              Works
            </a>
          </li>
          <li>
            <a href="#contact" className="block px-4 py-2 border-b border-purple-600 rounded-full hover:bg-[#7A34F2] transition  ">
              Contact
            </a>
          </li>
        </ul>

        {/* Right Side - Resume Button (For All Screens) */}
        <a
          href="https://drive.google.com/file/d/1XGm-Mt8RjL1FYJh_f6fk19wfzvPgeQVr/view?usp=sharing"
          target="_blank"
          className="bg-gray-900 border-b border-purple-600 hover:bg-[#7A34F2] text-white  py-2 px-4 rounded-full transition"
        >
          Resume
          <BorderBeam size={300} duration={20} colorFrom={'#7A34F2'} colorTo={'#87CEEB'} />

        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-gray-900 cursor-pointer w-full z-10 text-center absolute top-16 left-0">
          <li className="p-4 border-b border-gray-700">
            <a href="#about" className="block px-4 py-2 rounded-md hover:bg-[#7A34F2] transition  ">
              About
            </a>
          </li>
          <li className="p-4 border-b border-gray-700">
            <a href="#skill" className="block px-4 py-2 rounded-md hover:bg-[#7A34F2] transition  ">
              Skills
            </a>
          </li>
          <li className="p-4 border-b border-gray-700">
            <a href="#work" className="block px-4 py-2 rounded-md hover:bg-[#7A34F2] transition  ">
              Works
            </a>
          </li>
          <li className="p-4">
            <a href="#contact" className="block  px-4 pt-2 pb-4 rounded-md hover:bg-[#7A34F2] transition  ">
              Contact
            </a>
          </li>
          
        </ul>
      )}
    </nav>

    
  );
};

export default Nav;
