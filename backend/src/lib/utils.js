import jwt from "jsonwebtoken"

const gentoken = (userid, res)=>
{
  const secretkey = process.env.jwt_secret
  const token = jwt.sign({userid}, secretkey, {
    expiresIn: "7d"
  })

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/"
})


}

export default {gentoken}
