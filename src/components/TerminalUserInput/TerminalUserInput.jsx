import './TerminalUserInput.css';

const TerminalUserInput = ({handleOnKeyDown, terminalInputRef}) => {
  return (
    <div className="terminal__prompts__inputs">
      <span className="terminal__user__arrow"> &gt; </span>
      <textarea className="terminal__user__input" rows="1" cols="200" autoFocus onKeyDown={handleOnKeyDown} ref={terminalInputRef}></textarea>
    </div>
  )
}

export default TerminalUserInput;

