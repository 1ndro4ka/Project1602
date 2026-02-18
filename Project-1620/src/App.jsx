import { Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Page_main from "./pages/Page_main";
import Page_about from "./pages/Page_about";
import Page_schools from "./pages/Page_schools";
import Page_login from "./pages/Page_login";
import Page_register from "./pages/Page_register";
import Page_profile from "./pages/Page_profile";

function App() {
  return (
    <div className="app-wrapper">
      <NavBar />
      
      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Page_main />} />
          <Route path="/about" element={<Page_about />} />
          <Route path="/schools" element={<Page_schools />} />
          <Route path="/login" element={<Page_login />} />
          <Route path="/register" element={<Page_register />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Page_profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;