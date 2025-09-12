import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./layouts/Header"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Home from "./pages/Home"
import TermsCondition from "./pages/TermsCondition"
import Refund from "./pages/Refund"
import Contact from "./pages/Contact"
import Delivery from "./pages/Delivery"
import CheckoutPage from "./pages/CheckOutPage"
import ProductPage from "./pages/ProductPage"


function App() {
  return (
    <>

    <Routes>
      <Route path="/" element={<Home/>} /> 
      <Route path="/checkout" element={<CheckoutPage />} />   
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsCondition/>} />
      <Route path="/cancellation-refund" element={<Refund />} />
      <Route path="/delivery-policy" element={<Delivery />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/product/:id" element={<ProductPage />} />






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
