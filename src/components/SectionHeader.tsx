// src/components/common/SectionHeader.jsx

import React from "react";
import headerstyles from "../css/components/sectionheader.module.css"; 

/**
 * 범용 섹션 제목 및 부제 컴포넌트
 * * 이 컴포넌트는 모든 페이지에서 통일된 스타일로 제목 영역을 렌더링합니다.
 * 제목은 여러 줄로 구성될 수 있으며, 특정 줄을 굵게(bold) 강조할 수 있습니다.
 * * @param {string} subtitle - 메인 제목 위에 작게 표시되는 부제 텍스트입니다. (예: "공연 관람이 며칠 안 남았다면?")
 * @param {string[]} mainTitleLines - 메인 제목을 구성하는 문자열 배열입니다. (예: ["나의", "타임테이블"])
 * @param {number[]} [boldParts=[]] - mainTitleLines 중 굵게 표시할 줄의 '인덱스' 배열입니다.
 * * * --- 사용 예시 ---
 * * // 1. 기본 스타일 (제목의 두 번째 줄만 굵게):
 * <SectionHeader
 * subtitle="공연 관람이 며칠 안 남았다면?"
 * mainTitleLines={["나의", "타임테이블"]}
 * boldParts={[1]} // 인덱스 1인 "타임테이블"만 굵게 표시
 * />
 * * // 2. 제목 전체를 굵게 (한 줄일 때):
 * <SectionHeader
 * subtitle="나의 관심 페스티벌의"
 * mainTitleLines={["타임테이블 확인하기"]}
 * boldParts={[0]} // 인덱스 0인 "타임테이블 확인하기" 전체를 굵게 표시
 * />
 */
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
            // boldParts에 인덱스가 포함되어 있으면 boldText 클래스를 추가하여 굵게 처리
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