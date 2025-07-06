import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Works = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;

  useEffect(() => {
    axios.get(`https://user-task-server-rouge.vercel.app/works`)
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const showTechDetails = (techStack) => {
    Swal.fire({
      title: '🚀 Technologies Used',
      text: `${techStack} 💻`,
      icon: 'info',
      confirmButtonText: 'Close 😊',
      confirmButtonColor: '#6a0dad',
    });
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentProjects = projects.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(projects.length / cardsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div id="work" className="bg-black text-white py-14 px-6 flex flex-col items-center">
      <h2 className="text-4xl text-center uppercase tracking-wide">
        My Works
      </h2>
      <p className="mb-14 mt-5 text-center">
        A showcase of innovative projects that blend creativity with functionality.
      </p>

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-y-20 gap-x-12 pl-6 xl:pl-0 items-center justify-center">
        {currentProjects.map((project, index) => (
          <div
            key={index}
            className={`relative pb-10 xl:pb-16 flex flex-col lg:flex-row xl:flex-row items-center justify-center xl:gap-6 ${
              index % 2 === 0 ? "xl:flex-row" : "xl:flex-row-reverse"
            }`}
          >
            <div className="w-10 h-10 bg-purple-950 rounded-full border-2 border-white"></div>

            <div
              className="bg-gray-900/80 p-6 rounded-lg shadow-xl backdrop-blur-md
              border border-gray-700 transition-transform duration-300 ease-in-out hover:scale-105
              w-full max-w-lg text-center"
            >
              <h3 className="text-2xl text-purple-500 mb-2 hover:text-white transition">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-4 italic">{project.date}</p>

              <div className="relative group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all"></div>
              </div>

              {/* Buttons container with horizontal flex and smaller size */}
              <div className="flex gap-4 items-center justify-center mt-6 flex-wrap">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-purple-500 hover:text-white transition text-sm min-w-[110px] text-center cursor-pointer"
                >
                  View Site →
                </a>

                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-purple-500 hover:text-white transition text-sm min-w-[110px] text-center cursor-pointer"
                >
                  View Repo 🛠
                </a>

                <button
                  onClick={() => showTechDetails(project.tech)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-purple-500 hover:text-white transition text-sm min-w-[140px] text-center cursor-pointer"
                >
                  Technologies Used
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-4 mt-16">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-purple-500 rounded text-white disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-lg text-gray-300 mt-1">Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-purple-500 rounded text-white disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Works;
