const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

mongoose.connection.on("error", e => {
  console.log("Error: ", e);
});

// Schema visitor
const schemaVisitor = {
  date: Date,
  name: String,
};

const Visitor = mongoose.model("Visitor", schemaVisitor);

const app = express();

app.get("/", async (req, res) => {
  const { name } = req.query;
  const nombre = !name ? "Anónimo" : name;

  try {
    const visitor = new Visitor({
      date: new Date(),
      name: nombre,
    });

    const newVisitor = await visitor.save();
    newVisitor &&
      res.status(200).send(`<h1>El visitante fue almacenado con éxito</h1>`);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen("3000", () => {
  console.log("run server");
});
