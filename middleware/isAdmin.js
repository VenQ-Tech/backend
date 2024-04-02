
const isAdmin = (req, res, next) => {
    // Assuming you have a user object attached to the request (e.g., after authentication)
    const { isAdmin } = req.user;
  
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
  
    // If the user is an admin, proceed to the next middleware
    next();
  };
  
  module.exports = isAdmin;
  