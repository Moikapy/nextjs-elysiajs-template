
// components/BlogRenderer.jsx
import React from "react";

const BlogRenderer = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return <p>No content available.</p>;
  }

  console.log(content);
  

  return (
    <div>
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            if(Array.isArray(block.content)){
              return block.content.map((el,index)=>{
                if(el.type ==='text'){
                    return <p key={index} className={
                      el?.styles?.bold?'font-bold ':''
                    }
                    >{el.text || ""}</p>;
                }
                
              })
            }
            if(typeof block.content=== 'string'){

              return <p key={index}>{block.content || ""}</p>;

            }

            return <div/>
          case "heading":
            if(Array.isArray(block.content)){
              return block.content.map((el,index)=>{
                if(el.type ==='text'){
                   switch(block.content.props.level){
                     case 1:
                       return<h1>{el.text}</h1>
                     case 2:
                       return<h2>{el.text}</h2>
                     case 3:
                       return<h3>{el.text}</h3>
                   } 
                }
                
              })
            }
          case "bulletListItem":
            if(Array.isArray(block.content)){
             return(
               <ul>
               {
                block.content.map((el,index)=>{
                if(el.type ==='text'){
                   return <li key={index} style={{ listStyleType: "disc" }}>{el.text || ""}</li>
                }
              })

               }
               </ul>
             )
            }
          case "numberedListItem":
            if(Array.isArray(block.content)){
             return(
               <ol>
               {
                block.content.map((el,index)=>{
                if(el.type ==='text'){
                   return <li key={index} style={{ listStyleType: "decimal" }}>{el.text || ""}</li>
                }
              })

               }
               </ol>
             )
            }
          case "checkListItem":
            return (
              <div key={index}>
                <input type="checkbox" checked={block.checked || false} readOnly />
                <span>{block.content || ""}</span>
              </div>
            );
          case "table":
            return (
              <table key={index} className="table-auto border-collapse">
                <tbody>
                  {block.content.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.cells.map((cell, cellIndex) => 
                       {
                         return cell.map((c,i)=>{
                           return(
                             <td key={i} className="border px-4 py-2">{c.text}</td>                                      )
                         })
                       })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "image":
            return (
              <div key={index}>
                <img src={block.props.url} alt={block.props.caption} />
                <p>{block.props.caption}</p>
              </div>
            );
          case "video":
            return (
              <div key={index}>
                <video controls src={block.props.url} />
                <p>{block.props.caption}</p>
              </div>
            );
          case "audio":
            return (
              <div key={index}>
                <audio controls src={block.props.url} />
                <p>{block.props.caption}</p>
              </div>
            );
          case "link":
            return (
              <a key={index} href={block.href} target="_blank" rel="noopener noreferrer">
                {block.content}
              </a>
            );
          case "text":
            return (
              <span key={index} style={{ fontWeight: block.styles?.bold ? 'bold' : 'normal', fontStyle: block.styles?.italic ? 'italic' : 'normal' }}>
                {block.text}
              </span>
            );
          default:
            return <div key={index}>Unsupported block type</div>;
        }
      })}
    </div>
  );
};

export default BlogRenderer;
