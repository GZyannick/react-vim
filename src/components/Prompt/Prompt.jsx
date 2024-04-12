import './Prompt.css'
import { getTime } from '../../utils/GetTime.js';


const Prompt = ({children, directoryName}) => {
 return (
    <div className="prompt">
        <ul className='user__prompts__info'>
          <li className="user__name"> JohnDoe</li>
          <li className='user__path'>{directoryName}</li>
          <li className='datetime'>{getTime()}</li>
        </ul>
      {children}
    </div>
 )
}
export default Prompt
