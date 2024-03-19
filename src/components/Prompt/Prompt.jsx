import './Prompt.css'
import { getTime } from '../../utils/GetTime.js';


const Prompt = ({children}) => {
 return (
    <div className="prompt">
        <ul className='user__prompts__info'>
          <li className="user__name"> JohnDoe</li>
          <li className='user__path'>~/users/johndoe/dev</li>
          <li className='datetime'>{getTime()}</li>
        </ul>
      {children}
    </div>
 )
}
export default Prompt
