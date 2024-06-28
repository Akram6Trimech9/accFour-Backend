const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
dbConnect();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const authRouter = require("./routes/userRoute");
const chaufRouter= require("./routes/chauffeurRoute")
const fournisseurRouter= require("./routes/fournisseurRoute")
const  historyRouter = require('./routes/historiqueRoute')
const statisticsRoutes = require('./routes/statsController')
app.use("/api/user", authRouter);
app.use("/api/chauffeur",chaufRouter );
app.use("/api/fournisseur",fournisseurRouter );
app.use("/api/credit-history",historyRouter)
app.use('/api/statistics', statisticsRoutes);

app.use(notFound);
app.use(errorHandler);
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
