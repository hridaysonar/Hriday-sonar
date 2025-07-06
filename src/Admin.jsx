import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const techSuggestions = [
  'React', 'Tailwind CSS', 'Firebase', 'Framer Motion', 'AOS', 'React Icons', 'Node.js', 'Express', 'MongoDB'
];

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    repo: '',        // <-- Added repo field here
    tech: '',
    date: ''
  });

  const [suggested, setSuggested] = useState([]);
  const [submittedProjects, setSubmittedProjects] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-suggest tech tags
    if (name === 'tech') {
      const lastInput = value.split(',').pop().trim();
      const filtered = techSuggestions.filter(item =>
        item.toLowerCase().includes(lastInput.toLowerCase()) && lastInput !== ''
      );
      setSuggested(filtered);
    }
  };

  const addTechTag = (tag) => {
    const techArray = formData.tech.split(',').map(t => t.trim());
    techArray[techArray.length - 1] = tag;
    const newTech = techArray.join(', ');
    setFormData(prev => ({ ...prev, tech: newTech }));
    setSuggested([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, image, link, repo, tech, date } = formData;

    if (!title || !image || !link || !repo || !tech || !date) {  // Validate repo field as well
      Swal.fire('⚠️ Incomplete!', 'Please fill out all fields.', 'warning');
      return;
    }

    try {
      await axios.post(`https://hriday-personal-server.vercel.app/works`, formData);
      Swal.fire('✅ Success!', 'Work item added successfully!', 'success');
      setSubmittedProjects(prev => [...prev, formData]); // Add to preview
      setFormData({ title: '', image: '', link: '', repo: '', tech: '', date: '' });
      setSuggested([]);
    } catch (error) {
      Swal.fire('❌ Error', 'Failed to submit. Check your server.', 'error');
    }
  };

  const removePreview = (index) => {
    setSubmittedProjects(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 justify-center items-start px-6 py-10 mt-30">

      {/* Form */}
      <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">🛠️ Add New Work</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'image', 'link', 'repo', 'tech', 'date'].map((field) => (
            <div key={field} className="relative">
              <label className="block font-semibold mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-purple-600"
                placeholder={`Enter ${field}`}
              />
              {field === 'tech' && suggested.length > 0 && (
                <ul className="absolute bg-white shadow rounded mt-1 z-10 w-full max-h-40 overflow-y-auto border">
                  {suggested.map((tag, idx) => (
                    <li
                      key={idx}
                      onClick={() => addTechTag(tag)}
                      className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
          >
            ➕ Add Work
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="max-w-xl w-full space-y-6">
        {submittedProjects.length === 0 ? (
          <p className="text-gray-400 italic">No previews yet...</p>
        ) : (
          submittedProjects.map((proj, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg p-4 shadow hover:shadow-lg transition group"
            >
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✖
              </button>
              <img
                src={proj.image}
                alt={proj.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-xl font-semibold text-purple-700">{proj.title}</h3>
              <p className="text-sm text-gray-500 italic">{proj.date}</p>
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline mr-4"
              >
                🔗 Visit Site
              </a>
              <a
                href={proj.repo}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:underline"
              >
                🐱 View Repo
              </a>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Tech:</strong> {proj.tech}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
