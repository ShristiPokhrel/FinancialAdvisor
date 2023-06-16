const mongoose = require("mongoose");
const { compare, genSalt, hashSync } =require('bcrypt')
//schema design
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required and should be unique"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  const user = this 
  if (!user.isModified('password')) {
    return next()
  }
  const salt = await genSalt(11)
  const hash = await hashSync(user.password, salt)
  user.password = hash
  return next()
})
userSchema.methods.comparePassword = async function (
  candidatePassword,
) {
  const user = this 
  return compare(candidatePassword, user.password).catch(() => false)
}
//export
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
