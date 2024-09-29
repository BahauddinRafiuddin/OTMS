import { Route, Router, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Properties from "./pages/Properties"
import PropertyDeatails from "./pages/PropertyDeatails"
import About from "./pages/About"
import Contect from "./pages/Contect"
import Footer from "./components/Footer"
import Dashboard from "./pages/Dashboard"


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contect />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/propertydetails/:propertyId" element={<PropertyDeatails />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      {/* <Footer/> */}
    </>
  )
}

export default App
