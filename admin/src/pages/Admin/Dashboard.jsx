import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5 w-full'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border'>
          <img className='w-12' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-500'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border'>
          <img className='w-12' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-500'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded border'>
          <img className='w-12' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-500'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-8 border rounded'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div>
          {dashData.latestAppointments.map((item) => (
            <div key={item._id} className='flex items-center justify-between px-6 py-4 border-b text-sm'>
              <div>
                <p className='font-medium text-gray-800'>{item.userData.name}</p>
                <p className='text-gray-500'>{item.docData.name}</p>
              </div>
              <p className='text-gray-600'>{item.slotDate.replaceAll('_', '/')} | {item.slotTime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
