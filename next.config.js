/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'res.cloudinary.com', 
        'avatars.githubusercontent.com',
        'lh3.googleusercontent.com',
        'cdn.landesa.org'
      ]
    }
  }
  
  module.exports = nextConfig