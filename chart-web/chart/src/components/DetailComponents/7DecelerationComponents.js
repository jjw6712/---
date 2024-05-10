import  { React, useState } from 'react';

import '../../css/Detailcomponents/7DecelerationComponents.css'

function DecelerationComponent(){
  let [leakspeed, setleakspeed] = useState()
  let [leakspeedcount, setleakspeedcount] = useState()
  return(
    <div className='componentname'>
      <p>급감속 횟수</p>
      <p className='deceleration'>기준 초당 {leakspeed}km/h 증가 {leakspeedcount}회</p>
    </div>
  )
}

export default DecelerationComponent