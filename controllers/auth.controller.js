const { User }             = require('../models');
const bcrypt               = require('bcrypt');
const jwt                  = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const foundUser = await User.findOne({
          where: {
            email: email
          }
        });
    
        if (foundUser) {
            return res.status(404).json({
                status: 'Failed',
                msg: `Email already registered`
            })
        }
        const createdUser = await User.create({
            name: name,
            email: email,
            password: password,
            profile_picture: "https://res.cloudinary.com/dzskwtwm7/image/upload/v1669220512/user/user_quy29n.webp"
        });
        // const emailRes = await sendEmail(email, name);
        return res.status(201).json({
            status: 'success',
            msg: 'User created successfully',
            data: createdUser
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            msg: err.message
          }) 
    }
};
  
const login = async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findOne({
      where: {
        email: email
      }
    });

    if (!foundUser) {
        return res.status(404).json({
            status: 'Failed',
            msg: `Email not registered`
        })
    }

    const isValidPassword = bcrypt.compareSync(password, foundUser.password);
    if (isValidPassword) {
      const payload = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      return res.status(200).json({
        msg: "Login Success",
        token: token
      });
  };
    return res.status(400).json({
      status: 'Failed',
      msg: 'Wrong email or password'
    });
};



module.exports = { 
    register,
    login
}