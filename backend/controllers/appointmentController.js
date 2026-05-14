import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing appointment details" });
    }

    const docData = await doctorModel.findById(docId).select("-password -email");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    const slotsBooked = docData.slots_booked || {};
    const bookedTimesForDate = slotsBooked[slotDate] || [];

    if (bookedTimesForDate.includes(slotTime)) {
      return res.json({ success: false, message: "This slot is already booked" });
    }

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const appointmentAmount = docData.fee ?? docData.fees;
    if (appointmentAmount === undefined || appointmentAmount === null) {
      return res.json({ success: false, message: "Doctor fee is missing" });
    }

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: Number(appointmentAmount),
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    slotsBooked[slotDate] = [...bookedTimesForDate, slotTime];
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ userId: req.userId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment already cancelled" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const docData = await doctorModel.findById(appointmentData.docId);
    if (docData) {
      const slotsBooked = docData.slots_booked || {};
      const updatedSlots = (slotsBooked[appointmentData.slotDate] || []).filter(
        (time) => time !== appointmentData.slotTime
      );

      if (updatedSlots.length > 0) {
        slotsBooked[appointmentData.slotDate] = updatedSlots;
      } else {
        delete slotsBooked[appointmentData.slotDate];
      }

      await doctorModel.findByIdAndUpdate(appointmentData.docId, {
        slots_booked: slotsBooked,
      });
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({}).sort({ date: -1 }).limit(5);

    const dashData = {
      doctors: doctors.length,
      appointments: await appointmentModel.countDocuments(),
      patients: users.length,
      latestAppointments: appointments,
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  adminAppointments,
  adminDashboard,
  bookAppointment,
  cancelAppointment,
  listAppointments,
};
