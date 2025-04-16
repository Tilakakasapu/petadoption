import bcrypt from 'bcryptjs';

// Replace with the actual hashed password from your database
const storedHashedPassword = '$2a$10$AdBqrU3VoxnBqtQWyKjv2e4KrLfhxXZ/0ScLYA5ErQ4OnLUYFUKmS';

// Replace with the password you want to verify
const inputPassword = '12345678';

async function verifyPassword() {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
    if (isMatch) {
      console.log('Password matches!');
    } else {
      console.log('Password does not match.');
    }
  } catch (error) {
    console.error('Error during password verification:', error);
  }
}

verifyPassword();
