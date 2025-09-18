import { asyncHandler } from "../utils/asyncHandler.js";
import { sendsResponse } from "../utils/response.js";
import { hashPassword } from "../utils/hash.js";
import { User } from "../models/user.models.js";

/**
* @desc    Get current logged-in user profile
 * @route   GET /api/users/me
 * @access  Private (Access Token required)
 */
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshTokens");

  if (!user) {
    return res.status(404).json(sendsResponse(404, false, "User not found"));
  }

  return res.status(200).json(
    sendsResponse(200, true, "User profile fetched successfully", user)
  );
});


/**
 * @desc    Update logged-in user profile
 * @route   PATCH /api/users/me
 * @access  Private (Access Token required)
 */
export const updateUserProfile = asyncHandler(async(req, res) => {
  const userId = req.user.id;  // get user id from the auth middleware

  // only allow specifuc field to be updated 
  const allowedUpdates = ["fullName", "email", "password"];
  const updates = {};

  for(const key of allowedUpdates){
    if(req.body[key] != undefined){
      updates[key] = req.body[key];
    }
  }

  // Handle password update (hash it)
  if(updates.password){
    updates.password = hashPassword(updates.password);
  }

  // update user
  const updateUser = await User.findByIdAndUpdate(
    userId,
    {$set:updates},
    {new:true, runValidators:true}
  ).select("-password -refreshTokens");

  if(!updateUser){
    return res.status(404).sendsResponse(404, false, "User not found");
  }

  return res.status(200).json(
    sendsResponse(200, true, "User profile updated successfully", {
      id:updateUser._id,
      fullName:updateUser.fullName,
      email:updateUser.email,
      role:updateUser.role,
      createdAt:updateUser.createdAt,
      updatedAt:updateUser.updatedAt
    })
  );
});

/**
 * @desc    Soft delete (deactivate) logged-in user
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deactivateMyAccount = asyncHandler(async(req, res)=>{
  const userId = req.user.id;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select("-password -refreshTokens");

  if(!user){
    return res.status(200)
      .sendsResponse(200, true, "Your account has been deactivated (soft deleted)", user);
  }
});

/**
 * @desc    Admin deactivate (soft delete) any user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin only)
 */
export const deleteUserByAdmin = asyncHandler(async(req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if(!user){
    return res.status(404)
    .json(sendsResponse(404, false, "User not found"));
  }
  return res.status(200).json(
    sendsResponse(200, true, "User account deactivated successfully", user)
  );
});


/**
 * @desc    Reactivate user account (Admin only)
 * @route   PATCH /api/users/:id/reactivate
 * @access  Private (Admin only)
 */
export const  reactivateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id, 
    { isActive:true },
    { new:true }
  ).select("-password -refreshTokens");

  if(!user){
    return res.status(404).json(sendsResponse(404, false, "User not found"));
  }

  return res.status(200).json(
    sendsResponse(200, true, "User account reactivated successfully", user)
  );

});
