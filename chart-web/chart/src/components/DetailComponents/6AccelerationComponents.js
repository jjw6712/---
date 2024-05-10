import  { React, useState } from 'react';

import '../../css/Detailcomponents/6AccelerationComponents.css'

function AccelerationComponent(){
  let [extraspeed, setextraspeed] = useState()
  let [extraspeedcount, setextraspeedcount] = useState()
  return(
    <div className='componentname'>
      <p>급가속 횟수</p>
      <p className='acceleration'>기준 초당 {extraspeed}km/h 증가 {extraspeedcount}회</p>
    </div>
  )
}

export default AccelerationComponent