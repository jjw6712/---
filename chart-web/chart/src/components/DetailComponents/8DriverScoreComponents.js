import  { React, useState } from 'react';

import '../../css/Detailcomponents/8DriverScoreComponents.css'

function DriverScoreComponent(){
  let [currentdrivescore, setcurrentdrivescore] = useState()
  let [deductionscore, setdeductionscore] = useState()
  return(
    <div className='componentname'>
      <p>운전자 점수</p>
      <p className='current-drive-score-title'>현재 운전자 점수</p>
      <p className='current-drive-score'>{currentdrivescore}점</p>
      <p className='deduction-title'>감점 사유</p>
      <p className='deduction-score'>급가속 {deductionscore}회</p>
    </div>
  )
}

export default DriverScoreComponent