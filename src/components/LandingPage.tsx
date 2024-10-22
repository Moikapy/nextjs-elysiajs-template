'use client'
// components/LandingPage.jsx

// /app/page.jsx
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import BlogRenderer from "../components/BlogRenderer";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.blogs.get();
console.log(response.data.body);

        setBlogs(response.data.body.blogs);
        
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Blog</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.map((blog) => (
            <div key={blog._id} className="card bg-neutral p-6 border font-black border-accent">
              <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
              <div className="mb-4">
                {/* Render a preview of the first few blocks of the blog content */}
                {/*<BlogRenderer content={blog.content.slice(0, 3)} />*/}
              </div>
              <Link className="text-secondary hover:text-primary" href={`/blogs/${blog._id}`}>
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

