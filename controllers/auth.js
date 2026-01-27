exports.register = (req, res) => {
  res.status(200).json({ success: true, message: "User registered" });
};
