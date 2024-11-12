const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const  { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");


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

adminRouter.post("/signup", async function(req, res) {

    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin user
        await adminModel.create({
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

adminRouter.post("/signin", async function(req, res) {

    try {
        const { email, password } = signinSchema.parse(req.body);

        // Find the admin user by email
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password"
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

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

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
 try {
        const adminId = req.userId;
        const { title, description, imageUrl, price, courseId } = req.body;

        // Check if courseId is provided
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Prepare update object dynamically
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (price) updateData.price = price;

        // Attempt to update the course
        const result = await courseModel.updateOne(
            { _id: courseId, creatorId: adminId },
            { $set: updateData }
        );
        

        // Check if an update was made
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Course not found or no changes made" });
        }

        res.json({
            message: "Course updated successfully",
            courseId: courseId
        });
    } catch (error) {
        console.error("Course update error:", error);
        res.status(500).json({ message: "An error occurred while updating the course" });
    }
})

adminRouter.get("/course/bulk", adminMiddleware,async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "All the course of yours",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}