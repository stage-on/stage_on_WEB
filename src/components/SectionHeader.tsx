// src/components/SectionHeader.tsx

// ⭐️ 'React' import 제거 (TS6133 오류 해결) ⭐️
import headerstyles from "../css/components/sectionheader.module.css"; 

// ⭐️ Props 인터페이스 정의 (TS7031, TS7006, TS2345 오류 해결) ⭐️
interface SectionHeaderProps {
  subtitle: string;
  mainTitleLines: string[]; // 문자열 배열로 타입 명시
  boldParts?: number[]; // 숫자 배열로 타입 명시 (인덱스)
}

// ⭐️ Props에 타입 명시 ⭐️
const SectionHeader = ({ subtitle, mainTitleLines, boldParts = [] }: SectionHeaderProps) => {
  return (
    <div className={headerstyles.sectionHeaderGroup}>
      <p className={headerstyles.subtitle}>
        {subtitle}
      </p>
      <h2 className={headerstyles.mainTitle}>
        {/* map 함수 내부 line, index는 이미 타입이 추론됨 */}
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