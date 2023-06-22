const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const _handlebars = require("handlebars");
const expressHbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const validator = require("express-validator");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");

const routes = require("./routes/index");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();
const { mongodb_url } = require("./config/config");

mongoose.set("strictQuery", true);
mongoose.connect(mongodb_url);

require("./config/passport");

_handlebars.registerHelper("eq", function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

app.engine(
  ".hbs",
  expressHbs({
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    defaultLayout: "layout",
    extname: ".hbs",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");
app.use(cors());
app.use(logger("dev"));
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(validator());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://example.com", // specify the allowed origin(s)
    methods: ["GET", "POST"], // specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // specify the allowed headers
  })
);
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/", routes);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

module.exports = app;
