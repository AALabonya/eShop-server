import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  client_url: process.env.CLIENT_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_DEFAUL_PASS,
  admin_photo: process.env.ADMIN_PHOTO,
  store_id: process.env.STOREID,
  signature_key: process.env.SIGNATUREKEY,
  payment_url: process.env.PAYMENT_URL,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
