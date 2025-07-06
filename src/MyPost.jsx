import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPost = ({ user }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get(`https://hriday-personal-server.vercel.app/works`)
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete?");
        if (confirm) {
            await axios.delete(`https://hriday-personal-server.vercel.app/works/${id}`);
            setPosts(posts.filter(post => post._id !== id));
        }
    };

    const handleUpdate = (id) => {
        // তুমি চাইলে modal খুলে update form দেখাতে পারো
        console.log("Update post id:", id);
    };

    return (
        <div className='p-6'>
            <h2 className='text-xl font-bold mb-4'>🌐 All Posts</h2>
            {
                posts.length === 0 ? (
                    <p>Loading posts...</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className='bg-gray-800 text-white rounded shadow p-4 mb-4'>
                            <h3 className='text-xl font-semibold'>{post.title || "Untitled"}</h3>
                            {post.image && (
                                <img src={post.image} alt="Post" className='w-full h-40 object-cover mt-2 rounded' />
                            )}
                            <p className='text-sm mt-2 text-gray-300'>Tech: {post.tech}</p>
                            <p className='text-xs text-gray-400'>Posted by: {post.userEmail || "Unknown"}</p>

                            {user?.email === post.userEmail && (
                                <div className='flex gap-3 mt-3'>
                                    <button
                                        onClick={() => handleUpdate(post._id)}
                                        className='bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded'
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className='bg-red-600 hover:bg-red-700 px-3 py-1 rounded'
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )
            }
        </div>
    );
};

export default MyPost;
