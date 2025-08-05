import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./layouts/Header"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Home from "./pages/Home"
import TermsCondition from "./pages/TermsCondition"
import Refund from "./pages/Refund"
import Contact from "./pages/Contact"
import Delivery from "./pages/Delivery"


function App() {
  return (
    <>

    <Routes>
      <Route path="/" element={<Home/>} />    
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsCondition/>} />
      <Route path="/cancellation-refund" element={<Refund />} />
      <Route path="/shipping-delivery" element={<Delivery />} />
      <Route path="/contact-us" element={<Contact />} />






    </Routes>



    
   <div>
   
 
  {/* EndContent */}
  {/* Footer */}

  {/* End Footer */}
</div>

    </>
  )
}

export default App
