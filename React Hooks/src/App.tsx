import { Routes, Route } from "react-router-dom";
import { Memo, Callback, Context, Reducer, Ref, Layout, MemoAPI } from "./Hooks";
import { Home, Navigation } from "./Components";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="container mx-auto py-8 px-4">
        <Routes>
          {/* Home page at root path */}
          <Route path="/" element={<Home />} />

          <Route path="/memo" element={<Memo />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/context" element={<Context />} />
          <Route path="/reducer" element={<Reducer />} />
          <Route path="/ref" element={<Ref />} />
          <Route path="/layout" element={<Layout />} />
          <Route path="/memo-api" element={<MemoAPI />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
