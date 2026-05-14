import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1fr] gap-3 py-3 px-6 border-b font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Doctor</p>
          <p>Date & Time</p>
          <p>Status</p>
        </div>

        {appointments.map((item, index) => (
          <div key={item._id} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1fr] gap-3 py-3 px-6 border-b text-gray-600'>
            <p>{index + 1}</p>
            <div>
              <p className='font-medium text-gray-800'>{item.userData.name}</p>
              <p>{item.userData.email}</p>
            </div>
            <div>
              <p className='font-medium text-gray-800'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
            </div>
            <p>{item.slotDate.replaceAll('_', '/')} | {item.slotTime}</p>
            <p className={item.cancelled ? 'text-red-500' : 'text-green-600'}>
              {item.cancelled ? 'Cancelled' : 'Booked'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
