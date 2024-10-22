'use client'

// /app/blogs/[id]/page.jsx
import React, { useEffect, useState } from "react";
import {useEditor}from'../create/page.tsx'
import { api } from "../../../lib/api";
import BlogRenderer from "../../../components/BlogRenderer";
import { useRouter } from "next/navigation";

const BlogPage = ({params}) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState('')
  const router = useRouter();
  const {editor} = useEditor()
  const { id } = params;

  useEffect(() => {
    if (!id) return;
   
    const fetchBlog = async () => {
      try {
        const response = await api.blogs({id:id}).get();
        setBlog(response.data.body.blog);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div className="container flex flex-col mx-auto py-8">
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

