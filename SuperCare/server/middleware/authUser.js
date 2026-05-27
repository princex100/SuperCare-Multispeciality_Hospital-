import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (
    req,
    res,
    next
) => {

    const { token } =
        req.headers;

    // no token
    if (
        !token ||
        token === "undefined" ||
        token === "null"
    ) {
        return res.json({
            success: false,
            authError: true,
            message:
                "Authentication required"
        });
    }

    try {

        const token_decode =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.body.userId =
            token_decode.id;

        next();

    } catch (error) {

        console.log(error);

        return res.json({
            success: false,
            authError: true,
            message:
                "Session expired. Please login again"
        });
    }
}

export default authUser;