"use client";

import React from "react";

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  html,
  className = "",
}) => {
  // Create a more robust HTML parser that handles Quill's output format
  const parseHtmlSafely = (htmlString: string): React.ReactNode => {
    // Fallback for server-side rendering
    if (typeof document === "undefined") {
      return (
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
      );
    }

    try {
      const div = document.createElement("div");
      div.innerHTML = htmlString;

      // Convert the entire HTML structure to React components
      return convertNodeToReact(div);
    } catch (error) {
      console.error("Error parsing HTML:", error);
      // Fallback to dangerouslySetInnerHTML if parsing fails
      return (
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
      );
    }
  };

  const convertNodeToReact = (node: Node): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text && text.length > 0 ? text : null;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      const props: any = {
        key: Math.random().toString(36).substr(2, 9),
      };

      // Handle classes and styles
      if (element.className) {
        props.className = element.className;
      }

      if (element.getAttribute("style")) {
        props.style = element.getAttribute("style");
      }

      // Handle attributes
      if (tagName === "a" && element.getAttribute("href")) {
        props.href = element.getAttribute("href");
        props.target = "_blank";
        props.rel = "noopener noreferrer";
      }

      // Convert children
      const children = Array.from(element.childNodes)
        .map((child) => convertNodeToReact(child))
        .filter(
          (child) => child !== null && child !== undefined && child !== "",
        );

      // Handle different element types with proper styling
      switch (tagName) {
        case "h1":
          return (
            <h1
              {...props}
              className={`${props.className || ""} text-3xl font-bold mb-4`}
            >
              {children}
            </h1>
          );
        case "h2":
          return (
            <h2
              {...props}
              className={`${props.className || ""} text-2xl font-bold mb-3`}
            >
              {children}
            </h2>
          );
        case "h3":
          return (
            <h3
              {...props}
              className={`${props.className || ""} text-xl font-bold mb-2`}
            >
              {children}
            </h3>
          );
        case "p":
          return (
            <p
              {...props}
              className={`${props.className || ""} mb-4 leading-relaxed`}
            >
              {children}
            </p>
          );
        case "strong":
        case "b":
          return (
            <strong {...props} className={`${props.className || ""} font-bold`}>
              {children}
            </strong>
          );
        case "em":
        case "i":
          return (
            <em {...props} className={`${props.className || ""} italic`}>
              {children}
            </em>
          );
        case "u":
          return (
            <u {...props} className={`${props.className || ""} underline`}>
              {children}
            </u>
          );
        case "ul":
          return (
            <ul
              {...props}
              className={`${props.className || ""} list-disc list-inside mb-4`}
            >
              {children}
            </ul>
          );
        case "ol":
          return (
            <ol
              {...props}
              className={`${props.className || ""} list-decimal list-inside mb-4`}
            >
              {children}
            </ol>
          );
        case "li":
          return (
            <li {...props} className={`${props.className || ""} mb-1`}>
              {children}
            </li>
          );
        case "blockquote":
          return (
            <blockquote
              {...props}
              className={`${props.className || ""} border-l-4 border-gray-300 pl-4 italic my-4`}
            >
              {children}
            </blockquote>
          );
        case "a":
          return (
            <a
              {...props}
              className={`${props.className || ""} text-blue-600 hover:text-blue-800 underline`}
            >
              {children}
            </a>
          );
        case "br":
          return <br {...props} />;
        case "div":
          return (
            <div {...props} className={`${props.className || ""} mb-4`}>
              {children}
            </div>
          );
        case "span":
          return <span {...props}>{children}</span>;
        default:
          // For unsupported tags, render children directly
          return <>{children}</>;
      }
    }

    return null;
  };

  return <div className={className}>{parseHtmlSafely(html)}</div>;
};

export default SafeHtmlRenderer;
