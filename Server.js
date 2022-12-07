import mongoose from "mongoose";
import app from "./App.js";
import config from "./config/index";

// as soon as server.js run i want to connect to database
// step 1 -create a function
// step 2 - run a function
// we can call self invoking function IIFE or self invoking function
//(async () => {})()

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log(`Db connected `);

        app.on('error', (err) => {
            console.log("ERROR: ", err);
            throw err;
        });
        const onListening = () => {
            console.log(`App is listening on http://localhost:${config.PORT}`)
        }

        app.listen(config.PORT, () => onListening)

    } catch (err) {
        console.log("ERROR: ", err);
        //throw keyword will kill th execution or also use process.exit(1)
        throw err
    }

})()