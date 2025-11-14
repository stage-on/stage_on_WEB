// components/timetable/MyTimetable.tsx 파일 내용

import React from 'react';
// useNavigate 훅을 사용하기 위해 import 합니다.
import { useNavigate } from 'react-router-dom'; 
import mytimetablestyles from "../../css/components/timetable/mytimetable.module.css"; 
import sampleposter from "../../assets/timetable/poster.svg"; 
// ✅ 1. 이동 화살표 이미지를 새로 import 합니다. (경로는 예시입니다)
import arrowIconSVG from "../../assets/timetable/arrow-right.svg"; 
import heart from "../../assets/timetable/heart.svg";
export default function MyTimetable({ itemData }) {
    
    // 💡 2. 페이지 이동을 위한 useNavigate 훅을 사용합니다.
    const navigate = useNavigate();

    // 💡 3. 클릭 핸들러 함수: 상세 페이지로 이동
    const handleNavigation = () => {
        // TimetableDetailPage.tsx 경로로 이동합니다. 
        // URL에 해당 항목의 ID를 포함하여 상세 정보를 로드할 수 있게 합니다.
        navigate(`/timetable/detail/${itemData.id}`); 
    };

    return (
        // ✅ <li>는 목록 항목 전체를 감싸며, 클릭 이벤트가 발생할 수 있습니다.
        <li 
            key={itemData.id} 
            className={mytimetablestyles.timetableListItem} 
        >
            {/* 🚨 fullContainer div는 <li> 안에 불필요하며, HTML 구조를 깨지 않습니다. 
               목록 항목 전체를 클릭 가능하게 하려면, <li>에 onClick을 부여하는 것이 좋습니다. */}
            
            {/* 썸네일 영역 */}
            <img 
                src={ sampleposter} 
                alt={`${itemData.title} 포스터`} 
                className={mytimetablestyles.listThumbnail} 
            />
            
            {/* 정보 컨테이너 */}
            <div className={mytimetablestyles.infoContainer}>
                
                <div className={mytimetablestyles.listTitle}>{itemData.title}</div>
                
                <div className={mytimetablestyles.listDetails}>
                    <img src={heart} alt="좋아요 아이콘" className={mytimetablestyles.heartIcon} />
                    <span className={mytimetablestyles.heartCount}>{itemData.likes}</span>
                    | <span className={mytimetablestyles.location}>{itemData.location}</span>
                    | <span className={mytimetablestyles.date}>{itemData.date}</span>
                </div>
            </div>
            
            {/* ✅ 4. Arrow Icon을 <img>로 변경하고 클릭 이벤트 추가 */}
            <img 
                src={arrowIconSVG} 
                alt="상세 페이지 이동" 
                className={mytimetablestyles.arrowIcon}
                // 💡 클릭 시 상세 페이지로 이동
                onClick={handleNavigation} 
            />
            
        </li>
    );
}