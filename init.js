const mongoose = require("mongoose");

const Chat = require("./Models/chat.js")


main()
.then (() =>{
    console.log("connection successful");
})
.catch((err) =>{
    console.log(err);
});

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
// }

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChat = [
    {
    from: "neha",
    to : "rohit",
    msg: "send me your exam sheet",
    created_at: new Date(),
},
{
    from: "mohit",
    to : "sohan",
    msg: "send me your exam sheet",
    created_at: new Date(),
},
{
    from: "prince",
    to : "priya",
    msg: "send me your exam sheet",
    created_at: new Date(),
},
{
    from: "goyal",
    to : "soyal",
    msg: "send me your exam sheet",
    created_at: new Date(),
},
]

Chat.insertMany(allChat);
