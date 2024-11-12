const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const  { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const userRouter = Router();

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required")
});

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

userRouter.post("/signup", async function(req, res) {
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin user
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        res.status(201).json({
            message: "Signup successful"
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({
            message: "Signup failed",
            error: error.message || "Invalid request data"
        });
    }
})

userRouter.post("/signin",async function(req, res) {
    try {
        const { email, password } = signinSchema.parse(req.body);

        // Find the admin user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

        // Set token in a secure HTTP-only cookie
        res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 3600000 });

        res.json({
            message: "Signin successful",
            token: token
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(400).json({
            message: "Signin failed",
            error: error.message || "Invalid request data"
        });
    }
})

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}