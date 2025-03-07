import AsComponent from "./components/use-case/AsComponent";
import AsHook from "./components/use-case/AsHook";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Quill UI Test</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">As Component</h2>
            <AsComponent />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">As Hook</h2>
            <AsHook />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
