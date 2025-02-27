import React,{useCallback, useState} from 'react'
import { ExpensiveCalculation, Button  } from '../components';

const Callback:React.FC = () => {

  const [count, setCount] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);

  const incrementWithoutCallback=():void=>{
    setCount((prevCount)=>prevCount+1)
  }

  const incrementWithCallback=useCallback(()=>{
    setCount((prevCount)=>prevCount+1)
  },[])

  const incrementByFive=useCallback(()=>{
    setCount((prevCount)=>prevCount+5)
  },[])


  return (
<div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">useCallback Hook Example</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          This example demonstrates how <code className="bg-blue-100 px-1 rounded">useCallback</code> prevents 
          unnecessary re-renders of memoized components by preserving function references.
        </p>
      </div>
      
      <div className="flex justify-center items-center mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 mb-1">{count}</div>
          <div className="text-gray-500">Current Count</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 my-6">
        <Button handleClick={incrementWithoutCallback} name="Regular Button (No Callback)" />
        <Button handleClick={incrementWithCallback} name="Optimized Button (useCallback)" variant="primary" />
        <Button handleClick={incrementByFive} name="Increment by 5" variant="secondary" />
        <Button 
          handleClick={() => setToggle(!toggle)} 
          name={`Toggle: ${toggle ? "ON" : "OFF"}`} 
          variant="danger" 
        />
      </div>

      <div className="mb-6 p-5 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">What's happening?</h3>
        <ul className="list-disc list-inside space-y-2 text-indigo-700">
          <li>
            Each time the component renders, <code className="bg-indigo-100 px-1 rounded">incrementWithoutCallback</code> is recreated
          </li>
          <li>
            But <code className="bg-indigo-100 px-1 rounded">incrementWithCallback</code> is memoized and only created once
          </li>
          <li>
            The Toggle button creates a new inline function on every render
          </li>
          <li>
            Open your browser's console to see which buttons re-render when toggle changes
          </li>
        </ul>
      </div>

      <div className={`p-4 rounded-lg transition-colors ${toggle ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">Toggle State:</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium ${toggle ? 'bg-green-500' : 'bg-gray-500'}`}>
            {toggle ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          This toggle state causes re-renders. Watch which buttons re-render in the console.
        </p>
      </div>

      <ExpensiveCalculation count={count} />
    </div>
  )
}

export default Callback