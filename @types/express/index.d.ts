import Express from "express";

declare global {
    namespace Express {
        interface User {
            id: number;
            username: string;		
        }
    }
}