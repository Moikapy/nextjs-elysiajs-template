'use client'

// /app/blogs/[id]/page.jsx
import React, { useEffect, useState } from "react";

import { api } from "../../../lib/api";
import BlogRenderer from "../../../components/BlogRenderer";
import { useRouter } from "next/navigation";
const BlogPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await api.blogs[id].get();
        setBlog(response.blog);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <p>Loading...</p>
      ) : blog ? (
        <>
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <BlogRenderer content={blog.content} />
        </>
      ) : (
        <p>Blog not found.</p>
      )}
    </div>
  );
};

export default BlogPage;

