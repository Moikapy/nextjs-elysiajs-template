
// components/BlogRenderer.jsx
import React from "react";

const BlogRenderer = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return <p>No content available.</p>;
  }

  return (
    <div>
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.content || ""}</p>;
          case "heading":
            return <h2 key={index}>{block.content || ""}</h2>;
          case "bulletListItem":
            return <li key={index} style={{ listStyleType: "disc" }}>{block.content || ""}</li>;
          case "numberedListItem":
            return <li key={index} style={{ listStyleType: "decimal" }}>{block.content || ""}</li>;
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
                      {row.cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border px-4 py-2">{cell}</td>
                      ))}
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
