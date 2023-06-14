const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};
