import { session } from "express-session";

// Module Augmentation: express
declare global {
    namespace Express {
        interface User {
            id: number;
            username: string;		
        }   
    }
}

// Module Augmentation: express-session
declare module "express-session" {
    interface SessionData {
        returnTo?: string;
    }
}