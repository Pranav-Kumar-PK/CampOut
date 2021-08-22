const User = require("../models/user");
const nodemailer = require("nodemailer");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        const mailOutput = `<p>Please click on the link below to confirm your email id on CampOut <br> <a href="https://blooming-sea-54963.herokuapp.com/campgrounds?confirm=${user._id}">Verify Email</a> <br>Thank You</p>`;
        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();
            testAccount.user = process.env.GMAIL_USER;
            testAccount.pass = process.env.GMAIL_PASS;
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({

                service: "Gmail", // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'campout28@gmail.com', // sender address
                to: `${user.email}`, // list of receivers
                subject: "verify email", // Subject line
                // text: "Confirm Email", // plain text body
                html: mailOutput, // html body
            });

            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);


        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to CampOut");
            res.redirect("/campgrounds");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "Successfully logged in");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
}