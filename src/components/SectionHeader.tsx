import React from "react";
import headerstyles from "../css/components/sectionheader.module.css"; 

const SectionHeader = ({ subtitle, mainTitleLines, boldParts = [] }) => {
  return (
    <div className={headerstyles.sectionHeaderGroup}>
      <p className={headerstyles.subtitle}>
        {subtitle}
      </p>
      <h2 className={headerstyles.mainTitle}>
        {mainTitleLines.map((line, index) => (
          <span 
            key={index} 
            className={`${headerstyles.mainTitleLine} ${boldParts.includes(index) ? headerstyles.boldText : ''}`}
          >
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default SectionHeader;