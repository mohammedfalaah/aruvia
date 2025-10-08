import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./layouts/Footer.jsx";
import Header from "./layouts/Header.jsx";
import { Context_provider } from "./services/Context.jsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <HelmetProvider> 
    <Context_provider>
      <Header /> 
      <App />
      <Footer />
       <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              // Success toasts
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
              // Error toasts
              error: {
                duration: 4000,
                style: {
                  background: '#EF4444',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#EF4444',
                },
              },
            }}
          />
    </Context_provider>
        </HelmetProvider>
  </BrowserRouter>
);
