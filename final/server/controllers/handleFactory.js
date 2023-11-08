export const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: 'No document with that id' });
    res.status(204).json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: 'No document found with that id' });
    res.status(200).json({
      success: true,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
