import React, {useContext ,useEffect} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors,changeAvailability, backendUrl } = useContext(AdminContext)

  const deleteDoctor = async (id) => {
  try {

    const { data } = await axios.post(
      `${backendUrl}/api/admin/delete-doctor`,
      { id },
      {
        headers: {
          aToken
        }
      }
    )

    if (data.success) {
      toast.success(data.message)
      getAllDoctors()
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

  const getImageUrl = (image) => {
    if (!image) return ''
    if (image.startsWith('http')) return image

    const normalizedImage = image.replace(/\\/g, '/').replace(/^\/+/, '')

    if (normalizedImage.startsWith('uploads/')) {
      return `${backendUrl}/${normalizedImage}`
    }

    if (!normalizedImage.includes('/')) {
      return `${backendUrl}/uploads/${normalizedImage}`
    }

    return `${backendUrl}/${normalizedImage}`
  }

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }

  }, [aToken])

return (
  <div className='m-5 w-full'>

    {/* Header */}
    <div className='flex items-center justify-between mb-6'>
      <h1 className='text-3xl font-semibold text-gray-800'>
        All Doctors
      </h1>

      <button className='bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-all'>
        + Add Doctor
      </button>
    </div>

    {/* Table Container */}
    <div className='bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden'>

      {/* Table Header */}
      <div className='grid grid-cols-7 gap-4 px-6 py-5 bg-gray-50 border-b text-sm font-semibold text-gray-500'>

        <p>Image</p>
        <p>Name</p>
        <p>Speciality</p>
        <p>Experience</p>
        <p>Fees</p>
        <p>Available</p>
        <p>Action</p>

      </div>

      {/* Doctors List */}
      <div className='max-h-[75vh] overflow-y-auto'>

        {
          doctors.map((item, index) => (
            <div
              key={index}
              className='grid grid-cols-7 gap-4 items-center px-6 py-5 border-b hover:bg-gray-50 transition-all duration-200'
            >

              {/* Image */}
              <img
                className='w-16 h-16 rounded-2xl object-cover bg-indigo-50'
                src={getImageUrl(item.image)}
                alt={item.name}
              />

              {/* Name */}
              <div>
                <p className='font-semibold text-gray-800'>
                  {item.name}
                </p>

                <p className='text-sm text-gray-500'>
                  {item.email}
                </p>
              </div>

              {/* Speciality */}
              <p className='text-gray-700'>
                {item.speciality}
              </p>

              {/* Experience */}
              <p className='text-gray-700'>
                {item.experience || "5 Years"}
              </p>

              {/* Fees */}
              <p className='font-medium text-gray-800'>
                ₹{item.fees || item.fee || 0}
              </p>

              {/* Availability */}
              <div>
                <label className='flex items-center gap-2 cursor-pointer'>

                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className='w-4 h-4 accent-primary'
                  />

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>

                </label>
              </div>

              {/* Action */}
              <div className='flex items-center gap-3'>

              <button
  onClick={() => navigate(`/edit-doctor/${item._id}`)}
  className='border border-indigo-200 p-2.5 rounded-xl hover:bg-indigo-50 transition-all text-indigo-600'
>
  <FiEdit2 className='text-[18px]' />
</button>

              <button
  onClick={() => deleteDoctor(item._id)}
  className='border border-red-200 p-2.5 rounded-xl hover:bg-red-50 transition-all text-red-500'
>
  <FiTrash2 className='text-[18px]' />
</button>
              </div>

            </div>
          ))
        }

      </div>

      {/* Footer */}
      <div className='flex items-center justify-between px-6 py-4 bg-white'>

        <p className='text-sm text-gray-500'>
          Showing {doctors.length} doctors
        </p>

        <div className='flex items-center gap-2'>

          <button className='px-4 py-2 border rounded-xl text-sm text-gray-500'>
            Previous
          </button>

          <button className='px-4 py-2 border border-primary text-primary rounded-xl text-sm font-medium'>
            1
          </button>

          <button className='px-4 py-2 border rounded-xl text-sm text-gray-500'>
            Next
          </button>

        </div>

      </div>

    </div>

  </div>
)
}

export default DoctorsList
