export const checkEmail= "SELECT s FROM users s WHERE s.email=$1";
export const addUser = "INSERT INTO users (email,password) VALUES ($1,$2)";


//OTP send
export const addOtp = "INSERT INTO userotpverify (email,otp,createdat,expiresat) VALUES ($1,$2,$3,$4)";
export const checkEmailforOtp= "SELECT * FROM userotpverify WHERE email=$1";
export const deleteOtp= "DELETE FROM userotpverify WHERE email=$1";

//verify OTP
export const updateUser= "UPDATE users SET verified=TRUE WHERE email=$1";
export const updatedUser="SELECT * FROM users WHERE email=$1";



//login
export const logincheckmail ="SELECT * FROM users WHERE email=$1";


//forgotpassword resetpassword
export const insertToken="INSERT INTO tokens (email,token) VALUES ($1,$2)";
export const checktoken= "SELECT * FROM tokens WHERE email=$1";
export const updateUserpassword= "UPDATE users SET password=$2 WHERE email=$1";
export const deleteToken= "DELETE FROM tokens WHERE email=$1";







