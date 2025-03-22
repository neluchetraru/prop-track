import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";
import { auth } from "@prop-track/auth";
import { IncomingHttpHeaders } from "http";

export async function getSession(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers as IncomingHttpHeaders),
    });
    req.session = session?.session;
    req.user = session?.user;
    next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    console.log(req.session);
    if (!req.session) {
        res.status(401).send({
            error: 'Not authenticated',
        });
        return;
    }
    next();
}