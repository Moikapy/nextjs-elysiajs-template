'use client'

// /app/blogs/create/page.jsx
import React, { useEffect, useState } from "react";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
   const {editor} = useEditor()

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      // If not authenticated, redirect to login
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleCreateBlog = async () => {
    try {
      const token = await localStorage.getItem("authToken");
      if (title.length ===0) throw "Need Title";
      ;
      
      await api.blogs.create.post({
        title,
        content: editorContent,
      },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
).then(async()=>{
        await router.push("/blogs");

      });
         } catch (error) {
      console.error("Failed to create blog", error);
    }
  };

  if (!isAuthenticated) {
    // Render nothing if not authenticated (we are redirecting in the useEffect)
    return null;
  }

  return (
    <div className="container flex flex-col mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Create New Blog</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full bg-white"
          required
        />
      </div>
      <div className="mb-6">
          <BlockNoteView editor={editor} onChange={(newEditorContent) => {
      setEditorContent(newEditorContent.document);
    }}/>
             </div>
      <button onClick={handleCreateBlog} className="btn btn-primary">
        Create Blog
      </button>
    </div>
  );
};

export default CreateBlogPage;



export function useEditor(){

  const editor = useCreateBlockNote();

  return {editor};

}

