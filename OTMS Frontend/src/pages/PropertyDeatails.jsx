import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import '../components/Css/PropertyDetails.css'
import left from '../assets/left.svg'
import right from '../assets/rightArrow.svg'
import title from '../assets/hometitle.svg'
import info from '../assets/info.svg'
import doller from '../assets/doller.svg'
import address from '../assets/address.svg'
import bath from '../assets/bath.svg'
import filter from '../assets/filter.svg'
import bad from '../assets/badroom.svg'
import email from '../assets/email.svg'
import phone from '../assets/phone.svg'

const PropertyDeatails = () => {
  const { propertyId } = useParams()
  const [properties, setProperties] = useState({})
  const [landlord, setLandlord] = useState({})
  const [slide, setSlide] = useState(0)
  
  // State to control visibility of landlord details
  const [showLandlordDetails, setShowLandlordDetails] = useState(false)

  // Create a reference for the landlord details section
  const landlordRef = useRef(null)

  useEffect(() => {
    const getPropertyDetailsById = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/property/${propertyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed To Fetch Properties!!')
        }

        const data = await response.json()
        setProperties(data.responseData.property); // Set property details
        setLandlord(data.responseData.landlord); // Set landlord details
        // console.log(data)

      } catch (error) {
        throw new Error(error.message)
      }
    }

    getPropertyDetailsById()
  }, [propertyId])

  console.log("property: ", properties)
  console.log("Landlord: ", landlord)

  const nextImage = () => {
    setSlide(slide === properties.images.length - 1 ? 0 : slide + 1)
  }
  const previouseImage = () => {
    setSlide(slide === 0 ? properties.images.length - 1 : slide - 1)
  }


  const scrollToLandlordDetails = () => {
    setShowLandlordDetails(true) // Show the landlord details card
    setTimeout(() => {
      landlordRef.current.scrollIntoView({ behavior: 'smooth' }) // Scroll to the landlord section
    }, 100) // Optional delay for smoother scroll transition
  }

  return (
    <div className='property-details-page'>
      <h1>Property Details</h1>
      <div className="property-details-card">

        {/* Displaying Images On Left Side....................... */}
        <div className="left-side-iamges">
          <img src={left} alt="" className='arrow left-arrow' onClick={previouseImage} /> {/*left Arrow................*/}
          {properties && properties.images && properties.images.map((image, index) => {
            return <img src={image} alt={`Proerty Image ${index + 1}`} className={slide === index ? 'property-image' : 'property-image image-hidden'} key={index} />
          })}
          <img src={right} alt="" className='arrow right-arrow' onClick={nextImage} /> {/*Right Arrow..............*/}

          <span className='indicators'>
            {properties && properties.images && properties.images.map((_, index) => {
              return <button key={index} onClick={() => setSlide(index)} className={slide === index ? 'indicator' : 'indicator indicator-inactive'}></button>
            })}
          </span>
        </div>


        {/* Displaying Property Details On Right Side.............. */}
        <div className="right-side-property-details">
          <div className='property-title-adderess'>
            <div>
              <span><img src={title} alt="" className='titleImg' />Title</span>
              <h5>{properties.title}</h5>
            </div>

            <div>
              <span><img src={address} alt="" className='addressImg' />Adderess</span>
              <h5>{properties.address}</h5>
            </div>
          </div>

          <hr className='hrTage' />

          <div className='property-description'>
            <span><img src={info} alt="" />Description</span>
            <h5>{properties.description}</h5>
          </div>

          <hr className='hrTage' />

          <div className="property-type-price">
            <div>
              <span><img src={filter} alt="" />Property Type</span>
              <h5>{properties.propertyType}</h5>
            </div>

            <div>
              <span><img src={doller} alt="" />Price</span>
              <h5>{properties.price}</h5>
            </div>
          </div>

          <hr className='hrTage' />

          <div className="property-badrooms-bathrooms">
            <div>
              <span><img src={bad} alt="" />Number Of BadRooms</span>
              <h5>{properties.numberOfBedrooms}</h5>
            </div>

            <div>
              <span><img src={bath} alt="" />Number Of BathRooms</span>
              <h5>{properties.numberOfBathrooms}</h5>
            </div>
          </div>

          <hr className='hrTage' />

          {/* <div className='property-aminities'>
            <span>Amenities</span>
            {properties && properties.amenities && properties.amenities.map((item, index) => {
              return <h5>{item}</h5>
            })}
          </div> */}

          {/* Displaying Status Or Property........ */}
          <div className={properties.status === "Available" ? "property-status" : "property-status property-status-not-available"}>
            {properties.status}
          </div>

          {/* Button to scroll to landlord details */}
          <div className="scroll-button-container">
            <button onClick={scrollToLandlordDetails} className="scroll-to-landlord-button">
              View Landlord Details
            </button>
          </div>

        </div>

      </div>

      {/* landlord-details-card................................. */}
      {showLandlordDetails && (
        <div ref={landlordRef} className="landlord-details-card">
          <h5>Landlord Information</h5>
          <div className="landlord-info">
            {/* Landlord Profile Image */}
            {landlord.avatar ? (
              <img src={landlord.avatar} alt="Landlord" className='avatar-img' />
            ) : (
              <img src="default-profile.png" alt="Default Landlord" className='avatar-img' />
            )}
            <h5>{landlord.firstName} {landlord.lastName}</h5>

            <div className="landlord-contact">
              <div>
                <img src={email} alt="Email" />
                <span>{landlord.email}</span>
              </div>
              <div>
                <img src={phone} alt="Phone" />
                <span>{landlord.contact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PropertyDeatails