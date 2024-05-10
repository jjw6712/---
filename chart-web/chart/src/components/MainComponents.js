import React, { useEffect, useState } from 'react';

import DBChartComponent from './DBChartComponents'

import '../css/MainComponents.css'

function MainComponent(){
  return(
    <div className='bg1'>
      <DBChartComponent></DBChartComponent>
    </div>
  )
}

export default MainComponent