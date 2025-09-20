// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';
import type { User, Session } from '@prop-track/auth';

declare global {
    namespace Express {
        interface Request {
            session?: Session;
            user?: User;
        }
    }
}
