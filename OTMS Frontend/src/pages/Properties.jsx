import React, { useContext, useEffect, useState } from 'react'
import { PropertyContext } from '../context/PropertyContext'
import houseHeroImg from '../assets/property5.jpg'
import filter from '../assets/filter.svg'
import cross from '../assets/cross.svg'
import '../components/Css/Properties.css'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Properties = () => {
  const navigate = useNavigate()
  const { properties, getAllProeprties } = useContext(PropertyContext)
  const [filterProperties, setFilterProperties] = useState(properties)
  const {isLoggedIn}=useContext(AppContext)
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    amenities: ''
  })

  useEffect(() => {
    getAllProeprties()
  }, [])

  useEffect(() => {
    console.log("Properties--:", properties); // Log properties when they change
    setFilterProperties(properties); // Update when properties change
  }, [properties]); // Run this effect whenever properties change

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "amenities") {
      // Update the amenities array based on checkbox state
      setFilters((prevFilters) => {
        if (checked) {
          // Add value if checked
          return {
            ...prevFilters,
            amenities: [...prevFilters.amenities, value]
          };
        } else {
          // Remove value if unchecked
          return {
            ...prevFilters,
            amenities: prevFilters.amenities.filter((amenity) => amenity !== value)
          };
        }
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const applyFilters = () => {
    console.log(filters)
    let filtered = properties;

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(property => property.propertyType === filters.type);
    }

    // Filter by minPrice
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= Number(filters.minPrice));
    }

    // Filter by maxPrice
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= Number(filters.maxPrice));
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    // Update the state with filtered properties
    setFilterProperties(filtered);
  };

  // Clear Filters function
  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      amenities: []
    });
    setFilterProperties(properties); // Reset to show all properties
  };


  return (
    <div className='property-page'>
      <div className='properties-filter-sidebar'>
        <div className='filters'>

          <div className="property-type-filter">
            <span>Property Type</span>
            <select name="type" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              {/* Add more options as necessary */}
            </select>
          </div>

          <div className="property-price-filter">
            <span>Budget</span>
            <div className='min-max-price-select'>
              <select name="minPrice" onChange={handleFilterChange}>
                <option value="">Min Budget</option>
                <option value="500000">5 Lacs</option>
                <option value="1000000">10 Lacs</option>
                <option value="1500000">15 Lacs</option>
                {/* Add more options as necessary */}
              </select>

              <select name="maxPrice" onChange={handleFilterChange}>
                <option value="">Max Budget</option>
                <option value="500000">5 Lacs</option>
                <option value="1000000">10 Lacs</option>
                <option value="1500000">15 Lacs</option>
                {/* Add more options as necessary */}
              </select>
            </div>
          </div>


          <div className="property-amenities-filter">
            <span>Amenities</span>
            <div className="amenities-checkboxes">
              {["Pool", "Lift", "Gym", "Parking", "Garden"].map((amenity) => (
                <label key={amenity}>
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={filters.amenities.includes(amenity)} // Check if the amenity is in the filters
                    onChange={handleFilterChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className='filter-btn-div'>
            <button className='apply-filter-btn' onClick={applyFilters}><img src={filter} alt="" />Apply Filters</button>
            <button className='clear-btn' onClick={clearFilters}><img src={cross} alt="" />Clear Filters</button>
          </div>



        </div>
      </div>

      <div className='properties-details'>
        {filterProperties.map((property) => (
          <div className='property-card' key={property._id} onClick={() => { {isLoggedIn?navigate(`/propertydetails/${property._id}`):navigate('/login')} }}>
            <div className="property-card-image">
              <img src={property.images[0]} alt={property.title} />
            </div>
            <div className="property-card-details">
              <span>{property.title}</span>
              <p>{property.description}</p>
              <span>Price: {property.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Properties