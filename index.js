const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./Models/chat.js")
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
// }

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}




// index route
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", { chats });
});

//new route

app.get("/chat/new", (req, res) => {
    // throw new ExpressError(404, "chat not found");
    res.render("new.ejs");
});

//create route
app.post("/chats", async (req, res, next) => {
    try {
        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date(),
        });

        await newChat
            .save();
        res.redirect("/chats")
    } catch (err) {
        next(err)
    }
});

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    }
}

//NEW -show route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            next(new ExpressError(404, "chat not found"));
        }
        res.render("edit.ejs", { chat });
    } catch (err) {
        next(err)
    }

}));

//edit route

app.get("/chats/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
}));

//update route

app.put("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { msg: newMsg } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
        console.log(updatedChat);
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }

});

//destroy route

app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedchat = await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
});

app.get("/", (req, res) => {
    res.send("root working");
});

const handleValidationErr = (err) => {
    console.log("this was a validation error.please follow the rules");
    console.dir(err.message);
    return err;
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === "ValidationError") {
        err = handleValidationErr(err);
    }
    next(err);
});

// error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "some error ocurred" } = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
})