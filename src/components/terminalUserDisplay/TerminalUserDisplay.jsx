import './TerminalUserDisplay.css'

const TerminalUserDisplay = ({content}) => {

  return (
   <div className="terminal__prompts__inputs">
      <span className="terminal__user__arrow"> &gt; </span>
      <p className="old__user__input">{content}</p>
    </div> 
  )
}

export default TerminalUserDisplay;
