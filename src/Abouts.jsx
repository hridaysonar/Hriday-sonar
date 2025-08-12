import React from "react";
import myimge from '../public/img/me (2).jpeg'
const Abouts = () => {
  return (
    <section className="bg-black text-white py-16 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center justify-center gap-20 relative z-10">
        
        {/* Text Section */}
        <div className="max-w-2xl space-y-6">
          <div className="relative mb-8"> {/* Gap between heading and image */}
            <h2 className="text-green-400 font-bold text-xl tracking-wide">
              WHO I AM About?
            </h2>
            <div className="absolute -left-4 top-0 w-1 h-8 bg-green-400 rounded-full"></div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
            <p className="text-gray-200 leading-relaxed text-lg">
              My name is{" "}
              <span className="font-bold text-yellow-400">
                MD:Hriday Sonar
              </span>
             a passionate and dedicated programmer who thrives on turning ideas into functional, elegant solutions. With a strong self-learning attitude, I’m always eager to explore new technologies, improve my skills, and tackle challenges head-on.
            </p>

            <p className="text-gray-300 leading-relaxed text-lg mt-4">
             I enjoy working across the full stack of web application development and believe in building tools that make the web more open, accessible, and impactful. My core expertise lies in JavaScript, but I also work extensively with React, Node.js, and modern web development practices.{" "}
              <span className="font-semibold text-yellow-400">JavaScript</span> and
              I love to do most of the things using JavaScript. I am available for
              any kind of job opportunity that suits my skills and interests.
            </p>
          </div>

          {/* Skills Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["JavaScript", "React", "Node.js", "Web Dev"].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full text-sm font-medium text-purple-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-col items-center">
          <img
            src={myimge}
            alt="Hriday"
            className="rounded-2xl w-72 h-72 object-cover bg-gray-800 shadow-2xl mb-8"
          />
          <div className="bg-purple-700 px-6 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg">
            ABOUT ME
          </div>
        </div>
      </div>
    </section>
  );
};

export default Abouts;
