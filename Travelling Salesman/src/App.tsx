import Traveller from './components/Traveller';
import { tsp, cost } from './utils/algo';

const App = ()=> {
  
  console.log("Shortest Length:",tsp(cost))
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Traveling Salesman Problem Simulator</h1>
        <p className="text-gray-600">Create cities and connections to simulate the traveling salesman problem</p>
      </header>
      <Traveller />
    
    </div>
  );
};

export default App;