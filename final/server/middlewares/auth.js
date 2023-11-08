import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const requireSignin = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send('Unauthorized');
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export const belongToUser = async (req, res, next) => {
  try {
    const query = {
      user: req.user,
      products: { $in: req.body.products },
    };
    const userOrders = await User.findOne(query);
    if (!userOrders)
      res.status(400).json({
        success: false,
        message: 'Тільки для куплених продуктів можна зробити відгук',
      });
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
