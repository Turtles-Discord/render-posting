import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	
	if (!token) {
		logger.warn('No token provided');
		return res.status(401).json({ 
			success: false, 
			message: "Please login to continue" 
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			logger.warn('Invalid token decoded');
			return res.status(401).json({ 
				success: false, 
				message: "Session expired, please login again" 
			});
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		logger.error('Token verification error:', error);
		
		// Handle specific JWT errors
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ 
				success: false, 
				message: "Invalid token, please login again" 
			});
		}
		
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ 
				success: false, 
				message: "Session expired, please login again" 
			});
		}

		return res.status(500).json({ 
			success: false, 
			message: "Authentication error" 
		});
	}
};
