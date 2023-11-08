import Comment from '../models/comment.js';
import User from '../models/user.js';
import { deleteOne, updateOne } from './handleFactory.js';

export const createComment = async (req, res) => {
  try {
    const data = req.body;
    const productId = req.params.productId;
    const user = req.user;
    const newComment = await Comment.create({
      product: productId,
      user: user._id,
      text: data.text,
      rating: data.rating,
    });
    res.status(201).json({
      success: true,
      message: 'Comment created successful!',
      newComment,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteComment = deleteOne(Comment);
export const updateComment = updateOne(Comment);

export const createReply = async (req, res) => {
  try {
    const data = req.body;
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const newReply = {
      user: userId,
      text: data.text,
    };
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply } },
      { new: true }
    );
    if (updatedComment) {
      res
        .status(201)
        .json({ success: true, reply: newReply, comment: updatedComment });
    } else {
      res.status(404).json({ success: false, error: 'Comment not found' });
    }
  } catch (err) {
    console.error('Error creating reply:', err);
    res.status(500).json({ success: false, error: 'Failed to create reply' });
  }
};

export const listComments = async (req, res) => {
  try {
    const productId = req.params.productId;
    const comments = await Comment.find({ product: productId })
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'replies.user',
        select: 'name',
      });
    res.status(200).json({ data: comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const comments = await Comment.find({ product: productId });
    const totalRating = comments.length;
    if (totalRating > 0) {
      const sumOfRating = comments.reduce(
        (acc, comment) => acc + comment.rating,
        0
      );
      const averageRating = sumOfRating / totalRating;
      res.status(200).json({ success: true, averageRating, totalRating });
    } else {
      res.status(200).json({ success: true, averageRating: 0, totalRating: 0 });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
