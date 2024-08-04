const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = require("../models/listing.js");
const sampleData = require("./data.js");
const mongo_url = "mongodb://127.0.0.1:27017/RentalHome";

main()
  .then(() => {
    console.log("Successfully connect to database!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

const initDb = async () => {
  await Listing.deleteMany({});
  sampleData.data = sampleData.data.map((obj) => ({
    ...obj,
    owner: "66a7d7d04780fae7ae5ce790",
  })); // add owner to database
  const allData = await Listing.insertMany(sampleData.data);
  console.log(allData);
};

initDb();
