
const isAdmin = (req, res, next) => {
   
    const { isAdmin } = req.user;
  
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
  
    // If the user is an admin, proceed to the next middleware
    next();
  };
  
  module.exports = isAdmin;
  