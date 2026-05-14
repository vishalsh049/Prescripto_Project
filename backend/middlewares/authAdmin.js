import jwt from 'jsonwebtoken';

// admin authentication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    next(); // ✅ VERY IMPORTANT
  } catch (error) {
    const isJwtError = ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name);

    if (isJwtError) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authAdmin;
