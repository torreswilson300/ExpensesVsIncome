import rateLimit from "../config/upstash.js";    

const rateLimiter = async (req, res, next) => {
    try {
        // Apply rate limiting to the request
        const {userId} = req.params 
        const {success} = await rateLimit.limit(userId)  // Use userId to create a unique key for each user);
        
       if(!success){
        return res.status(429).json({ error: 'Too many requests, please try again later.' });
       
        } else {
            next(); // If the request is within the limit, proceed to the next middleware
    } 
    }
catch (error) {
        console.error('Rate limiter error:', error);
        next(error); // Pass the error to the next middleware for handling
    }
}



export default rateLimiter;
