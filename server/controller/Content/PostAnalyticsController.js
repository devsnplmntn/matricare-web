const PostAnalytics = require("../../models/Content/PostAnalytics");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const post_get = catchAsync(async (req, res, next) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const post = await PostAnalytics.find({
    updatedAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  }).populate("comments");

  if (!(post.length > 0))
    return next(new AppError("Post Analytics not found", 404));

  return res.status(200).json({ post });
});

module.exports = {
  post_get,
};
