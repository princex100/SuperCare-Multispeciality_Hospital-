import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import razorpay from 'razorpay';
import crypto from 'crypto';


//sendEMAIL function

import nodemailer from "nodemailer";
import Mailgen from "mailgen";


//genrating email content
const generateVerificationMailgenContent = (
    username,
    verificationURL
) => {
    return {
        body: {
            name: username,

            intro:
                "Welcome to SuperCare! Please verify your email to activate your account.",

            action: {
                instructions:
                    "Click the button below to verify your account. This link will expire in 10 minutes.",

                button: {
                    color: "#22BC66",
                    text: "Verify Account",
                    link: verificationURL,
                },
            },

            outro:
                "If you did not create an account, you can safely ignore this email.",
        },
    };
};


//sendemail function
const sendMail = async (options) => {
    try {
        // mailgen instance
        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "SuperCare",
                link: process.env.CLIENT_URL,
            },
        });

        // generate html mail
        const html =
            mailGenerator.generate(
                options.mailgenContent
            );

        // generate plain text mail
        const text =
            mailGenerator.generatePlaintext(
                options.mailgenContent
            );

        // transporter
       const transporter =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

        // structured mail object
        const mail = {
            from: `SuperCare Team`,
            to: options.to,
            subject: options.subject,
            text,
            html,
        };

        // send mail
        await transporter.sendMail(mail);

        return {
            success: true,
            message: "Email sent successfully",
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error.message,
        };
    }
};



// Gateway Initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
// import bcrypt from "bcrypt";
// import validator from "validator";
// import crypto from "crypto";
// import userModel from "../models/userModel.js";

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    // checking required fields
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // normalize email
    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // validate email
    if (
      !validator.isEmail(
        normalizedEmail
      )
    ) {
      return res.json({
        success: false,
        message:
          "Please enter a valid email",
      });
    }

    // validate password
    if (password.length < 8) {
      return res.json({
        success: false,
        message:
          "Please enter a strong password",
      });
    }

    // check if user exists
    const existingUser =
      await userModel.findOne({
        email: normalizedEmail,
      });

    // verified account exists
    if (
      existingUser &&
      existingUser.isVerified
    ) {
      return res.json({
        success: false,
        message:
          "Account already exists. Please login",
      });
    }

    // generate raw verification token
    const rawVerificationToken =
      crypto.randomBytes(32).toString(
        "hex"
      );

    // hash token before storing
    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(rawVerificationToken)
        .digest("hex");

    // token expiry (10 min)
    const verificationExpiry =
      Date.now() + 10 * 60 * 1000;

    // verification url
    const verificationUrl = `${
      process.env.CLIENT_URL
    }/verify-email?token=${rawVerificationToken}`;

    // hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // generate mailgen content
    const mailgenContent =
      generateVerificationMailgenContent(
        name,
        verificationUrl
      );

    // options object
    const options = {
      to: normalizedEmail,
      subject:
        "Verify Your SuperCare Account",
      mailgenContent,
    };

    // send email
    const emailResponse =
      await sendMail(options);

    // if mail failed
    if (!emailResponse.success) {
      return res.json({
        success: false,
        message:
          emailResponse.message,
      });
    }

    // existing user but unverified
    if (
      existingUser &&
      !existingUser.isVerified
    ) {
      existingUser.name = name;

      existingUser.password =
        hashedPassword;

      existingUser.emailVerificationToken =
        hashedVerificationToken;

      existingUser.emailVerificationExpiry =
        verificationExpiry;

      await existingUser.save();

      return res.json({
        success: true,
        message:
          "Verification email resent successfully",
      });
    }

    // create new user
    await userModel.create({
      name,
      email: normalizedEmail,
      password:
        hashedPassword,

      isVerified: false,

      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpiry:
        verificationExpiry,
    });

    return res.json({
      success: true,
      message:
        "Verification email sent successfully",
    });

  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};


//verify email
const verifyEmail = async (
    req,
    res
) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.json({
                success: false,
                message:
                    "Verification token missing",
            });
        }

        // hash incoming token
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

        // find user
        const user =
            await userModel.findOne({
                emailVerificationToken:
                    hashedToken,
            });

        if (!user) {
            return res.json({
                success: false,
                message:
                    "Invalid verification link",
            });
        }

        // check expiry
        if (
            user.emailVerificationExpiry <
            Date.now()
        ) {
            return res.json({
                success: false,
                message:
                    "Verification link expired",
            });
        }

        // verify user
        user.isVerified = true;

        user.emailVerificationToken =
            null;

        user.emailVerificationExpiry =
            null;

        await user.save();

        // auto login token (expires in 7 days)
        const authToken =
            jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

        return res.json({
            success: true,
            token: authToken,
            message:
                "Email verified successfully",
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message:
                error.message,
        });
    }
};

// API to login user
const loginUser = async (
    req,
    res
) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await userModel.findOne({
                email
            });

        // user not found
        if (!user) {
            return res.json({
                success: false,
                message:
                    "Please register first"
            });
        }

        // email verification check
        if (!user.isVerified) {
            return res.json({
                success: false,
                message:
                    "Please verify your email first"
            });
        }

        // password check
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.json({
                success: false,
                message:
                    "Invalid credentials"
            });
        }

        // jwt token (expires in 7 days)
        const token =
            jwt.sign(
                {
                    id: user._id
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

        res.json({
            success: true,
            token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message:
                error.message
        });
    }
}
const getProfile = async (
    req,
    res
) => {

    try {

        const { userId } =
            req.body;

        const userData =
            await userModel
                .findById(userId)
                .select("-password");

        res.json({
            success: true,
            userData
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message:
                error.message
        });
    }
}
// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image to cloudinary using buffer (memoryStorage compatible)
            const b64 = Buffer.from(imageFile.buffer).toString("base64")
            const dataURI = `data:${imageFile.mimetype};base64,${b64}`
            const imageUpload = await cloudinary.uploader.upload(dataURI, { resource_type: "image" })
            const imageURL = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.json({ success: false, message: 'Razorpay keys are not configured' })
        }

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        if (appointmentData.payment) {
            return res.json({ success: false, message: 'Appointment already paid' })
        }

        // creating options for razorpay payment
        const options = {
            amount: Math.round(appointmentData.amount * 100),
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: 'Missing Razorpay payment details' })
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.json({ success: false, message: 'Payment verification failed' })
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
        res.json({ success: true, message: "Payment Successful" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    verifyEmail
}
