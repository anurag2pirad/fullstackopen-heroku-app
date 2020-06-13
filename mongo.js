import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongp.js <password>");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://anurag:${password}@anurags-cluster-nqrkb.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  //.then((res) => console.log("Connected succesfully"))
  .catch((err) => console.log("Couldn't connect. Error: ", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((p) => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
