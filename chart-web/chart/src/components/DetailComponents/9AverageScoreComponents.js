import  { React, useState } from 'react';

import '../../css/Detailcomponents/9AverageScoreComponents.css'

function AverageScoreComponent(){
  let [avgdrivescore, setavgdrivescore] = useState()
  return(
    <div className='componentname'>
      <p>평균 점수</p>
      <p className='avg-drive-score'>{avgdrivescore}점</p>
    </div>
  )
}

export default AverageScoreComponent