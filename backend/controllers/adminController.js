import validator from 'validator'
import bycrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

// API for adding doctor
const addDoctor = async (req,res) => {

try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const image = req.file
    

    //checking for all datas to add doctor

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !image) {
        return res.json({ success:false,message:"Missing Details" })
        
    }
    
    //validating email format
    if (!validator.isEmail(email)) {
        return res.json({ success:false,message:"Please enter a valid email" })  
    }

    //validating strong password
    if (password.length < 8) {
        return res.json({ success:false,message:"Please enter a strong password" }) 
    }

    //hashing doctor password
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)


    let imageUrl = `/uploads/${image.filename}`

    // Prefer Cloudinary when credentials are configured, but keep local uploads working as a fallback.
    if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && (process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET_KEY)) {
        try {
            const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"})
            imageUrl = imageUpload.secure_url
        } catch (uploadError) {
            console.log('Cloudinary upload failed, using local upload instead:', uploadError.message)
        }
    }

const doctorData = {

    name,
    email,
    image:imageUrl,
    password:hashedPassword,
    speciality,
    degree,
    experience,
    about,
    fee: Number(fees),
    address:JSON.parse(address),
    date:Date.now()
}

const newDoctor = new doctorModel(doctorData)
await newDoctor.save()

res.json({ success:true, message:"Doctor Added " })

} catch (error) {
    console.log(error);
    res.json({ success:false, message:"Internal Server Error" })
}

}

//Api for admin login 

const loginAdmin = async (req,res) =>{
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

const token = jwt.sign({ email },process.env.JWT_SECRET)
res.json({success:true,token})

        } else{
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//api to get all doctors list for admin panel

const allDoctors = async (req,res) => {

    try{
        const doctors = await doctorModel.find({}).select("-password")
        res.json({ success:true, doctors })

    }catch (error) {
        console.log(error)
        res.json({ success:false, message:error.message})

    }

}

const deleteDoctor = async (req,res) => {

    try {

        const { id } = req.body

        await doctorModel.findByIdAndDelete(id)

        res.json({
            success:true,
            message:"Doctor Deleted Successfully"
        })

    } catch (error) {

        console.log(error)

        res.json({
            success:false,
            message:error.message
        })

    }

}

export {addDoctor,loginAdmin,allDoctors,deleteDoctor}
