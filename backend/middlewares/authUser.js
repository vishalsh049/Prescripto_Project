import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;

    if (!authHeader) {
      return res.json({ success: false, message: 'Not Authorized Login Again' });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   req.userId = decoded.id;

    next();

  } catch (error) {
    const isJwtError = ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name);

    if (isJwtError) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    console.log('JWT ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;
