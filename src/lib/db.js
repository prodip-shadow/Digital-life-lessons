import mongoose from "mongoose";

const rawUri = process.env.DB_URI;
if (!rawUri) {
  throw new Error("DB_URI is not defined in environment variables");
}
const uri = rawUri.replace(/^["']|["'];?$/g, "").replace(/;$/, "");

// Setup cached connection for Next.js HMR to prevent multiple connection pools
if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose.connect(uri, {
    dbName: "digital-life-lessons"
  });
}

// Clear cached models in development to force schema re-evaluation on HMR
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.User;
  delete mongoose.models.Session;
  delete mongoose.models.Account;
  delete mongoose.models.Verification;
  delete mongoose.models.Lesson;
  delete mongoose.models.Comment;
}

// 1. User Schema & Model (mapped to 'user' collection)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  image: { type: String },
  isPremium: { type: Boolean, default: false },
  premiumExpires: { type: Date, default: null },
  earningsHistory: [{
    date: { type: Date, default: Date.now },
    lessonId: { type: String },
    lessonTitle: { type: String },
    readerName: { type: String },
    amount: { type: Number }
  }],
  favorites: [{ type: String }],
  description: { type: String, default: "" },
  studyAt: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false, collection: "user" });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 2. Session Schema & Model (mapped to 'user' collection)
const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false, collection: "user" });

export const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);

// 3. Account Schema & Model (mapped to 'user' collection)
const AccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accountId: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  idToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  refreshTokenExpiresAt: { type: Date },
  scope: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false, collection: "user" });

export const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);

// 4. Verification Schema & Model (mapped to 'user' collection)
const VerificationSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  value: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false, collection: "user" });

export const Verification = mongoose.models.Verification || mongoose.model("Verification", VerificationSchema);

// 5. Lesson Schema & Model (mapped to 'lessons' collection)
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: [{ type: String }],
  quote: { type: String },
  closing: { type: String },
  category: { type: String, required: true },
  tone: { type: String },
  coverImage: { type: String },
  isPremium: { type: Boolean, default: false },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String },
    lessonsCount: { type: Number, default: 1 }
  },
  tags: [{ type: String }],
  readers: [{ type: String }],
  likedBy: { type: [String], default: [] },
  favoritesBy: { type: [String], default: [] },
  isVisible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  stats: {
    likes: { type: String, default: "0" },
    bookmarks: { type: String, default: "0" },
    views: { type: String, default: "0" }
  }
}, { collection: "lessons" });

export const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

// 6. Comment Schema & Model (mapped to 'comments' collection)
const CommentSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  content: { type: String, required: true },
  parentId: { type: String, default: null },
  replyToUserId: { type: String, default: null },
  replyToUserName: { type: String, default: null },
  likedBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
}, { collection: "comments" });

export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

