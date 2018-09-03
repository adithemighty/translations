const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const config = require("./config");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const hbs = require("hbs");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const LocalStrategy = require("passport-local").Strategy;
const Translator = require("./models/Translator");
const WO = require("./models/WO");
const bcrypt = require("bcrypt");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const { upload } = require("./handlers/cloudinary");
const cookieParser = require("cookie-parser");

//MONGO SETUP
//connect to MongoDB
mongoose.connect(
  "mongodb://localhost/translations",
  { useNewUrlParser: true }
);

//serves all files from translations-client/public folder through "/"
app.use(express.static(path.join(__dirname, "../translations-client/public")));

//Save sessions so that there is no need
//to constantly log in when server is restarted
app.use(
  session({
    secret: "translations",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

//VIEW ENGINE SETUP
app.set("views", path.join(__dirname, "../translations-client/views"));
app.set("view engine", "hbs");

//PASSPORT SETUP
passport.serializeUser((user, cb) => {
  cb(null, { id: user.id, role: user.collection.collectionName });
});

passport.deserializeUser((user, cb) => {
  if (user.role === "translators") {
    Translator.findById(user.id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  } else if (user.role === "wos") {
    WO.findById(user.id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  }
});

passport.use(
  "local-login",
  new LocalStrategy((username, password, next) => {
    //TODO ADD AUTH WITH EMAIL
    console.log("signin");

    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }

      return next(null, user);
    });
  })
);

passport.use(
  "local-signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      // To avoid race conditions
      const { email, role, idNumber } = req.body;
      process.nextTick(() => {
        const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        //check for roles: either WO or translator

        if (role === "Volunteer" || role === "Professional") {
          Translator.findOne(
            {
              username
            },
            (err, user) => {
              if (err) {
                return next(err);
              }
              if (user) {
                return next(null, false);
              } else {
                const newTranslator = new Translator({
                  username,
                  email,
                  password: hashPass,
                  role
                });

                newTranslator.save(err => {
                  if (err) {
                    next(null, false, { message: newTranslator.errors });
                  }
                  return next(null, newTranslator);
                });
              }
            }
          );
        } else if (role === "wo") {
          WO.findOne(
            {
              username
            },
            (err, user) => {
              if (err) {
                return next(err);
              }
              if (user) {
                return next(null, false);
              } else {
                const newWo = new WO({
                  username,
                  email,
                  password: hashPass,
                  idNumber
                });

                newWo.save(err => {
                  if (err) {
                    next(null, false, { message: newWo.errors });
                  }
                  return next(null, newWo);
                });
              }
            }
          );
        }
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

//ALL ROUTES

app.use("/", indexRouter);
app.use("/", authRouter);

//ERRORS SETUP
app.use((req, res, next) => {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`server starting on port ${config.PORT}`);
});

module.exports = app;
