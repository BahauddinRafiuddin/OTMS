import { createContext, useEffect, useState } from "react";

export const PropertyContext = createContext()

const PropertyContextProvider = (props) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch recently Added Properties..
    // useEffect(() => {
    //     const getRecentlyAddedProperties = async () => {
    //         try {
    //             const response = await fetch('http://localhost:4000/api/property/best-properties', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             })

    //             if (!response.ok) {
    //                 throw new Error("Failed To Fetch Properties")
    //             }

    //             const data = await response.json();
    //             setProperties(data);
    //             console.log(data,data.resentlyAddedPropeties)

    //         } catch (error) {
    //             setError(error.message)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //     getRecentlyAddedProperties()
    // }, [])

    // Get All Properties....
    const getAllProeprties = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/property/', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed To Fetch Properties!!')
            }

            const data = await response.json()
            setProperties(data.property)
            console.log(data)
        } catch (error) {
            throw new Error(error.message)
        }
    }
    const value = {
        properties, loading, error, getAllProeprties
    }

    return (
        <PropertyContext.Provider value={value}>
            {props.children}
        </PropertyContext.Provider>
    )
}

export default PropertyContextProvider