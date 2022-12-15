import mongoose from "mongoose";

import app from "./app";

import config from "./config/index";

//create a fn
//run the fn
//IIFE
(async () => {
    try {
      
        await mongoose.connect(config.MONGODB_URL);
        console.log("DB Connected");

        app.on("error", (err) => {
        //express way event like jQuery
        console.log("Error is: ", err);
        throw err;
        });

        const onListening = () => {
            console.log(`Listening on ${config.PORT}`)
        }

        app.listen(config.PORT, onListening)

    }
    catch (err) {
        console.log("ERROR: ", err);
        throw err; //kills execution
    }
})();
