import "./style.css"
import { useReducer } from "react";
import DigitButton from "./DigitButton"
import OperationButton from "./operationButton";


export const ACTIONS={
  ADD_DIGIT : "add-digit",
  OPERATOR: "operator",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate"
}

function reducer(state, {type,payload}){
  // eslint-disable-next-line
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          curr:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit==="0" && state.curr==="0") return state
      if(payload.digit==="."&& state.curr.includes("."))
      return state
      return {
        ...state,
        curr: `${state.curr || ""}${payload.digit}`,
      }
    case ACTIONS.OPERATOR:
      if (state.curr == null && state.prev == null){
        return state
      }

      if (state.curr == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }



      if (state.prev == null){
        return{
          ...state,
          operation:payload.operation,
          prev:state.curr,
          curr:null,
        }
      }
      return {
        ...state,
        prev: evaluate(state),
        operation:payload.operation,
        curr:null
      }
    


    case ACTIONS.CLEAR:
      return {}

    
    case ACTIONS.DELETE:
      if(state.overwrite){
        return{
          ...state,
          overwrite:false,
          curr:null
        }
      }

      if (state.curr == null) return state
      if (state.curr.length === 1) {
        return{...state, curr:null}
      }

      return{
        ...state,
        curr: state.curr.slice(0, -1)
      }



    case ACTIONS.EVALUATE:
       if(
        state.operation == null ||
        state.curr == null ||
        state.prev == null
       ){
        return state
       }
       return {
        ...state,
        overwrite:true,
        prev:null,
        operation: null,
        curr: evaluate(state)
       }

  }
}

function evaluate({curr,prev,operation}){
  const prevOP = parseFloat(prev)
  const currOP = parseFloat(curr)
  if(isNaN(prevOP) || isNaN(currOP)) return ""
  let computation = ""
   // eslint-disable-next-line
  switch(operation){
    case "+":
      computation = prevOP + currOP
      break
    case "-":
      computation = prevOP - currOP
      break    
    case "/":
      computation = prevOP / currOP
      break      
    case "*":
      computation = prevOP * currOP
      break
      
  }
  return computation.toString()
}




const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits : 0,
})
function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {

  const [{prev, curr, operator}, dispatch] = useReducer(reducer,{}) 




  return (
    <div className="calculater-grid">
      <div className="output">
      
      <div className="pre">{formatOperand(prev)} {operator}</div>
      <div className="cur">{formatOperand(curr)}</div>
      </div>
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
      
    </div>
    
  );
}

export default App;
