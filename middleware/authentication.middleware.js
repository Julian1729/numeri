exports.checkAuthentication = (req, res) => {

  if(!req.isAuthenticated()){
    return res.send('not logged in')
  }

  return res.send('logged in here');

}
