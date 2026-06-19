import '../src/lib/db.js';
import { User } from '../src/lib/db.js';

async function setPremium() {
  const email = process.argv[2] || 'prodiphore2005@gmail.com';
  console.log(`Setting premium for user email: ${email}`);
  try {
    const result = await User.updateOne(
      { email },
      { $set: { isPremium: true, premiumExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) } }
    );
    console.log('Update result:', result);

    const user = await User.findOne({ email });
    console.log('User status after update:', user);
  } catch (err) {
    console.error('Error updating user:', err);
    process.exit(1);
  }
  process.exit(0);
}

setPremium();
