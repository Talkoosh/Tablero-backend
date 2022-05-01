const authService = require('./auth.service');
const logger = require('../../services/logger.service');

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    logger.error('Failed to Login ' + err);
    res.status(401).send({ err: 'Failed to Login' });
  }
}

async function signup(req, res) {
  try {
    const { username, password, email } = req.body;
    const imgUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw6gPdTJZBPtbYx3HAuVX5yVanr0fMp18qnw&usqp=CAU'
    const account = await authService.signup(username, password, email, imgUrl);
    logger.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    );
    const user = await authService.login(email, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    logger.error('Failed to signup ' + err);
    res.status(500).send({ err: 'Failed to signup' });
  }
}

async function logout(req, res) {
  try {
    // req.session.destroy()
    req.session.user = null;
    res.send({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' });
  }
}

async function getLoggedinUser(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      res.send(null);
    } else res.send(user);
  } catch (err) {
    res.status(500).send({ err: 'Couldnt get user' });
  }
}

async function googleLogin(req, res) {
  try {
    const user = await authService.googleLogin(req.body);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    logger.error('Failed to Login ' + err);
    res.status(401).send({ err: 'Failed to Login' });
  }
}

module.exports = {
  login,
  signup,
  logout,
  getLoggedinUser,
  googleLogin
};
