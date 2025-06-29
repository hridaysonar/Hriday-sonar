import dog from '../public/img/img-2.png';
import log from '../public/img/img-3.png';
import img from '../public/img/img-1.png';
import win from '../public/img/img-4.png';
import Swal from 'sweetalert2';

const Works = () => {
    const projects = [
        {
            title: "Loyer or lawyer",
            image: img,
            link: "https://funny-pixie-dd37f6.netlify.app/",
            date: "April 2025",
            tech: "React,  react-icon, fremer-motion, aos, Tailwind CSS",
        },
        {
            title: "Docktor",
            image:dog ,
            link: "https://stunning-platypus-d00166.netlify.app/",
            date: "April 2025",
            tech: "React, Tailwind CSS,  ",
        },
        {
            title: "Login page",
            image: log,
            link: "https://cool-shortbread-0b6809.netlify.app/",
            date: "April 2025",
            tech: "React, firebase, Tailwind CSS",
        },
        {
            title: "My winter project",

            image: win,
            link: "https://graceful-marigold-0784d2.netlify.app/",
            date: "february 2025",
            tech: "React,   Tailwind CSS",
        },
    ];

    const showTechDetails = (techStack) => {
        Swal.fire({
            title: '🚀 Technologies Used',
            text: `${techStack} 💻`,
            icon: 'info',
            confirmButtonText: 'Close 😊',
            confirmButtonColor: '#6a0dad',
        });
    };
    
    return (
        <div id='work' className="bg-black text-white py-14 px-6 flex flex-col items-center">
            <h2 className="text-4xl text-center uppercase tracking-wide">
                My Works
            </h2>
            <p className='mb-14 mt-5 text-center'>
                A showcase of innovative projects that blend creativity with functionality.
            </p>

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12 border-l-4 xl:border-l-0 xl:border-gray-600 pl-6 xl:pl-0 items-center justify-center">
                {projects.map((project, index) => (
                    <div 
                        key={index} 
                        className={`relative pb-10 xl:pb-16 flex flex-col lg:flex-row xl:flex-row items-center justify-center xl:gap-6 ${
                            index % 2 === 0 ? "xl:flex-row" : "xl:flex-row-reverse"
                        }`}
                    >
                        <div className="w-10 h-10 bg-purple-950 rounded-full border-2 border-white"></div>

                        <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl backdrop-blur-md border border-gray-700 transform hover:-translate-y-2 transition-all duration-300 w-full max-w-md text-center">
                            <h3 className="text-2xl   mb-2 text-purple-500 hover:text-white transition">
                                {project.title}
                            </h3>
                            <p className="text-gray-400 mb-4 italic">{project.date}</p>

                            <div className="relative group">
                                <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-48 object-cover rounded-lg shadow-lg transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all"></div>
                            </div>

                            {/* Button Group */}
                            <div className="flex flex-col xl:flex-row gap-4 items-center justify-center mt-4">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 rounded-lg   bg-white cursor-pointer hover:bg-purple-500 text-purple-600 hover:text-white font-boldtransition w-full max-w-xs text-center"
                                >
                                    View Site →
                                </a>

                                <button
                                    onClick={() => showTechDetails(project.tech)}
                                    className="px-6 py-2 rounded-lg   bg-gray-700 text-white cursor-pointer hover:bg-purple-500 hover:text-white w-full max-w-xs text-center"
                                >
                                    Technologies Used
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Works;
