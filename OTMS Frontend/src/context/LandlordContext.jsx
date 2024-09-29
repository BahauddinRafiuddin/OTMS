import { createContext } from "react";

export const LandlordContext = createContext()

const LandlordContextProvider = (props) => {
    const value = {

    }

    return (
        <LandlordContext.Provider value={value}>
            {props.children}
        </LandlordContext.Provider>
    )
}

export default LandlordContextProvider