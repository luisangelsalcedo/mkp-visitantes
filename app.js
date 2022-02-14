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
  count: Number,
};

const Visitor = mongoose.model("Visitor", schemaVisitor);

const app = express();
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const { name } = req.query;
  const nombre = !name ? "Anónimo" : name;

  const visita = await Visitor.findOne({ name: nombre });

  if (!!visita && visita.name !== "Anónimo") {
    await Visitor.updateOne(visita, { count: visita.count + 1 });
  } else {
    const visitor = new Visitor({
      date: new Date(),
      name: nombre,
      count: 1,
    });

    const newVisitor = await visitor.save();
  }
  const visitantes = await Visitor.find();
  await res.render("index.ejs", { visitantes: visitantes });
});

app.listen("3000", () => {
  console.log("run server");
});
