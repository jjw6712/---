import  { React } from 'react';
import DIstanceComponent from './DetailComponents/1DIstanceComponents'
import DriveTimeComponent from './DetailComponents/2DriveTimeComponents'
import FuelComponent from './DetailComponents/3FuelComponents'
import EngineLoadComponent from './DetailComponents/4EngineLoadComponents'
import SpeedComponent from './DetailComponents/5SpeedComponents'
import AccelerationComponent from './DetailComponents/6AccelerationComponents'
import DecelerationComponent from './DetailComponents/7DecelerationComponents'
import DriverScoreComponent from './DetailComponents/8DriverScoreComponents'
import AverageScoreComponent from './DetailComponents/9AverageScoreComponents'
import StartEndLocationComponent from './DetailComponents/10Start-End-LocationComponents'
import AccidentOccurPercentageComponent from './DetailComponents/11AccidentOccurPercentageComponents'

import '../css/DetailComponent.css'

function DetailComponent(){
  return(
    <div className='bg'>

      <div className='div1'>
        <div className='div1-1'>
          <div className='div1-1-1'>
            <div className='div1-1-1-1'>
              <DIstanceComponent></DIstanceComponent>
            </div>
            <div className='div1-1-1-2'>
              <DriveTimeComponent></DriveTimeComponent>
            </div>
          </div>
          <div className='div1-1-2'>
            <div className='div1-1-2-1'>
              <FuelComponent></FuelComponent>
            </div>
            <div className='div1-1-2-2'>
              <EngineLoadComponent></EngineLoadComponent>
            </div>
          </div>
          <div className='div1-1-3'>
            <div className='div1-1-3-1'>
              <SpeedComponent></SpeedComponent>
            </div>
            <div className='div1-1-3-2'>
              <div className='div1-1-3-2-1'>
                <AccelerationComponent></AccelerationComponent>
              </div>
              <div className='div1-1-3-2-2'>
                <DecelerationComponent></DecelerationComponent>
              </div>
            </div>
          </div>
          <div className='div1-1-4'>
            <div className='div1-1-4-1'>
              <DriverScoreComponent></DriverScoreComponent>
            </div>
            <div className='div1-1-4-2'>
              <AverageScoreComponent></AverageScoreComponent>
            </div>
          </div>
        </div>
        <div className='div1-2'>
          <div className='div1-2-1'>
            <div className='div1-2-1-1'>
              <StartEndLocationComponent></StartEndLocationComponent>
            </div>
          </div>
          <div className='div1-2-2'>
            <AccidentOccurPercentageComponent></AccidentOccurPercentageComponent>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DetailComponent