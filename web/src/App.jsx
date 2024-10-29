import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import languageOptions from "./constants/languageOptions";

const App = () => {
  const data = languageOptions;
  return (
    <>
      <header className="b border-emerald-950"></header>
      <section className="min-h-full">
        <Routes>
          <Route path="/" element={<Home languages={data} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </section>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default App;
