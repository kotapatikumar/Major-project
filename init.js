
const mongoose=require("mongoose");
const finalData=require("./database.js");


const Listing=require("./models/listing.js");

main()
.then((res)=>{
    console.log("Successfully connected..")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/lovevisit');
}

const assignDB =async()=>{
    await Listing.deleteMany({});
    finalData.data=finalData.data.map((obj)=> ({...obj, owner:'66bce5e9fbde804b930020a2'}));
    await Listing.insertMany(finalData.data);
}
assignDB();