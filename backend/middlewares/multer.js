import fs from 'fs';
import path from 'path';
import multer from 'multer'; 

const storage = multer.diskStorage({
    destination: function(req,file,callback){
        const uploadPath = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        callback(null, uploadPath)
    },
    filename: function(req,file,callback){
        callback(null, file.originalname)// Set the filename to the original name of the file
    }
})

const upload = multer({storage})

export default upload
