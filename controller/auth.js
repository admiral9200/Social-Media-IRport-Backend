const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const User = require('../models/User');
dotenv.config()
const SECRET = process.env.SECRET;
const HOST =  process.env.SMTP_HOST
const PORT =  process.env.SMTP_PORT
const USER =  process.env.SMTP_USER
const PASS =  process.env.SMTP_PASS

exports.register = async (req, res) => {
    const { name, email, password, password2, role } = req.body;
    let errors = [];

    if (!name || !email || !password || !role) {
        errors.push({ msg: "Please enter all fields" });
    }

    if (password != password2) {
        errors.push({ msg: "Passwords do not match!" });
    }

    if (password.length < 8) {
        errors.push({ msg: "Password must be at least 8 characters" });
    }

    if (errors.length > 0) {
        res.send({ errors });
    } else {
        User.findOne({ email: email }).then(async (user) => {
            if (user) {
                errors.push({ msg: "Email address already registered!" });
                res.send({ errors });
            } else {
                try {
                    const hashedPassword = await bcryptjs.hash(password, 12);
                    await User.create({ email, password: hashedPassword, name, role });
                    res.status(200).json({ msg: "creating ok" });
                } catch (err) {
                    res.status(500).json({ msg: "Something went wrong!" });
                }
            }
        })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ msg: "User doesn't exist!" });

        const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ msg: "Invalid Password!" });

        const token = jwt.sign({ name: existingUser.name, email: existingUser.email, id: existingUser._id, role: existingUser.role }, "12345678", { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong!" });
    }
}

exports.logout = (req, res) => {

}

exports.forgotPassword = (req, res) => {

    const { email } = req.body

    // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: USER,
            pass: PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })


    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User does not exist in our database" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "Accountill <hello@accountill.com>",
                        subject: "Password reset request",
                        html: `
                    <p>You requested for password reset from Arc Invoicing application</p>
                    <h5>Please click this <a href="https://accountill.com/reset/${token}">link</a> to reset your password</h5>
                    <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                    <p>https://accountill.com/reset/${token}</p>
                    <P>If this was a mistake, just ignore this email and nothing will happen.</P>
                    `
                    })
                    res.json({ message: "check your email" })
                }).catch((err) => console.log(err))

            })
    })
}

exports.resetPassword = (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcryptjs.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((savedUser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
}

