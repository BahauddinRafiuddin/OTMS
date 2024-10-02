import React, { useState } from 'react'
import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const LandlordProfile = () => {
  const { userType, userId } = useContext(AppContext)
  const [landlord, setLandlord] = useState()
  // console.log("user Id: ",userId)

  useEffect(() => {
    const getLandlordById = async () => {
      try {
        const respose = await fetch(`http://localhost:4000/api/landlord/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!respose.ok) {
          throw new Error('Failed To Fetch Landlord Details!!')
        }

        const data = await respose.json()
        // console.log(data.landlords)
        setLandlord(data.landlords)
      } catch (error) {
        console.log(error)
        throw new Error(error.message)
      }
    }
    getLandlordById()
  }, [])

  console.log(landlord)
  return (
    <div className='landlord-profile-page'>

    </div>
  )
}

export default LandlordProfile