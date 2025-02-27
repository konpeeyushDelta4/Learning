import { Home, Callback, Memo } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/memo" element={<Memo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
