import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyHost = async(req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).send("Access Denied");
        }

        const user = await User.findById(req.user.id);
        if (!user || !user.host) {
            return res.status(403).send("Access Denied");
        }

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyAdmin = async(req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).send("Access Denied");
        }

        const user = await User.findById(req.user.id);
        if (!user || !user.admin) {
            return res.status(403).send("Access Denied");
        }

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};