import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Nav from "./components/Nav";
import Router from "./router/router";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <div className="content">
          <Router />
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
