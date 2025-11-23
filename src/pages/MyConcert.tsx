import React from 'react'
import myConcertsStyle from "../css/pages/myconcert.module.css";
import MyConcertsCard from '../components/MyConcertsCard';

const MyConcert = () => {
  return (
    <div className={myConcertsStyle.MyConcerts}>
    <div className={myConcertsStyle.MyConcertstitle}>My Concerts</div>
    <MyConcertsCard/>
    </div>
  )
}

export default MyConcert