// src/types/express.d.ts

// 1. Import the actual User type you want to use
import { User } from '../user/Entity/user.entity'; // Adjust path if necessary

// 2. Use declare module 'express' to augment the Request interface
declare module 'express' {
  // Augment the Request interface
  interface Request {
    // Add the user property with its correct type.
    // It's not optional (?) here because your route is protected by AuthGuard().
    user: User;
  }
}
