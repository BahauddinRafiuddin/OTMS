import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../components/Css/MyProperties.css';

const MyProperties = () => {
    const { userId } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const getPropertyByLandlordId = async () => {
            if (!userId || !token) {
                setError("User is not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/property/landlord/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch landlord properties!');
                }

                const data = await response.json();
                console.log('API Response:', data); // Log the full response

                // Ensure that data.properties is defined and is an array
                if (Array.isArray(data.properties)) {
                    setProperties(data.properties);
                } else {
                    throw new Error('Properties data is not an array!');
                }
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getPropertyByLandlordId();
    }, [userId]); // Only depend on userId

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="landlord-properties">
            <h2>My Properties</h2>
            {properties.length === 0 ? (
                <p>No properties found.</p>
            ) : (
                <div className="property-grid">
                    {properties.map((property) => (
                        <div key={property._id} className="my-property-card">
                            <h3 className="property-title">{property.title}</h3>
                            <p className="property-description"><strong>Description:</strong> {property.description}</p>
                            <p className="property-address"><strong>Address:</strong> {property.address}</p>
                            <p className="property-details"><strong>Type:</strong> {property.propertyType}</p>
                            <p className="property-details"><strong>Price:</strong> ${property.price.toLocaleString()}</p>
                            <p className={property.status==="Available"?"property-details green":"property-details red"}><strong className={property.status==="Available"?"black":"black"}>Status:</strong> {property.status}</p>
                            <p className="property-amenities"><strong>Amenities:</strong> {property.amenities.join(', ')}</p>
                            <p className="property-details"><strong>Bedrooms:</strong> {property.numberOfBedrooms}</p>
                            <p className="property-details"><strong>Bathrooms:</strong> {property.numberOfBathrooms}</p>
                            <div className="property-image-gallery">
                                {property.images.map((image, index) => (
                                    <img key={index} src={image} alt={`${property.title} - Image ${index + 1}`} className="property-image" />
                                ))}
                            </div>
                            {/* <div className="property-timestamps">
                                <p><strong>Created At:</strong> {new Date(property.createdAt).toLocaleString()}</p>
                                <p><strong>Updated At:</strong> {new Date(property.updatedAt).toLocaleString()}</p>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProperties;
