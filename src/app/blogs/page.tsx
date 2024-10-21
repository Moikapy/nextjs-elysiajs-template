'use client'


// /app/blogs/page.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AllBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }

    const fetchBlogs = async () => {
      try {
        const response = await api.blogs.get();
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
      <h1 className="text-4xl font-bold mb-6">All Blogs</h1>
      {isAuthenticated && (
        <Link className="btn btn-primary mt-6" href="/blogs/create">
          Create New Blog
        </Link>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {blogs?.map((blog) => (
            <li key={blog._id} className="mb-4">
              <Link className="text-lg text-primary" href={`/blogs/${blog._id}`}>
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default AllBlogsPage;

