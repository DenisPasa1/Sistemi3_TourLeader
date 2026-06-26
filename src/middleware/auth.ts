import { Request, Response, NextFunction } from "express";

export const requireLogin = (req: Request, res: Response, next: NextFunction): void => {
    if (!(req.session as any).user) {
        res.status(401).json({ error: "Niste prijavljeni" });
        return;
    }
    next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req.session as any).user;
    if (!user || user.role !== "admin") {
        res.status(403).json({ error: "Dostop zavrnjen" });
        return;
    }
    next();
};