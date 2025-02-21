import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

interface TokenPayload {
  userId: string;
  role: "admin" | "talent";
  iat: number;
  exp: number;
}

export function generateToken(userId: string, role?: string) {
  const expiresIn = "1d";

  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string | undefined): TokenPayload | null {
  if (!token) {
    return null;
  }
  const decoded = jwt.verify(token, JWT_SECRET);

  return decoded as TokenPayload;
}

export function decoded(token: string | undefined): TokenPayload | null {
  if (!token) {
    return null;
  }
  const decoded = jwt.decode(token);

  return decoded as TokenPayload;
}
