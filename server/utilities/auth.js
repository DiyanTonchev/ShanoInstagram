module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      // If not authenticated - login.
      res.redirect(302, '/user/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.includes(role)) {
        next()
      } else {
        // If not authorized - login with proper account.
        res.redirect(302, '/user/login')
      }
    }
  }
}
