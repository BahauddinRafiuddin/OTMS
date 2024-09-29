import { createContext } from "react";

export const TenantContext = createContext()

const TenantContextProvider = (props) => {
    const value = {

    }

    return (
        <TenantContext.Provider value={value}>
            {props.children}
        </TenantContext.Provider>
    )
}

export default TenantContextProvider