import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { getImageUrl } from '../utils/image'

const MyAppointments = () => {
  const { appointments, backendUrl, token, getUserAppointments } = useContext(AppContext)

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return `${dateArray[0]}/${dateArray[1]}/${dateArray[2]}`
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
         {appointments.map((item) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={item._id}>
              <div>
                <img className='w-32 bg-indigo-50' src={getImageUrl(item.docData.image, backendUrl)} alt={item.docData.name} />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'> 
                <button disabled className='text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed'>
                  {item.payment ? 'Paid' : 'Pay Online'}
                </button>
                {item.cancelled ? (
                  <button disabled className='text-sm text-red-500 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed'>
                    Appointment Cancelled
                  </button>
                ) : (
                  <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                    Cancel appointment
                  </button>
                )}
              </div>
            </div>          
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
