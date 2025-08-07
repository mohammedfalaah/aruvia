import { createContext, useState } from "react";

export const contextData = createContext();

export const Context_provider = ({ children }) => {   
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    
    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSideBarToggle = () => {
        setSideBarOpen(prev => !prev);
        document.body.classList.toggle('pushmenu-push-toleft');
    };

    const handleSidebarClose = () => {
        setSideBarOpen(false);
        document.body.classList.remove('pushmenu-push-toleft');
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <contextData.Provider value={{ 
            isCartOpen,
            setIsCartOpen,
            sideBarOpen,
            setSideBarOpen,
            handleSideBarToggle,
            handleSidebarClose,
            handleCartToggle,
            capitalizeFirstLetter
        }}>
            {children}
        </contextData.Provider>
    );
};