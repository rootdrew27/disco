import sqlite3 from 'sqlite3';
import crypto from 'crypto';

interface UserResult extends sqlite3.RunResult {
  id: number;
  username: string;
  hashed_password: Buffer;
  salt: crypto.BinaryLike;
}

export default UserResult;
