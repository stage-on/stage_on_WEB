// src/components/SectionHeader.tsx

import headerstyles from "../css/components/sectionheader.module.css"; 

interface SectionHeaderProps {
  subtitle: string;
  mainTitleLines: string[]; 
  boldParts?: number[]; 
}

const SectionHeader = ({ subtitle, mainTitleLines, boldParts = [] }: SectionHeaderProps) => {
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