const functions = require("firebase-functions");
const app = require("express")()
const { admin,db } = require("./utils/admin")

app.post("/createUser" , (req , res) => {
    const inputs = req.body;
   return promise =  admin.auth().createUser({
        email : inputs.email,
        password : inputs.password
    }).then((user) => {
        req.user = user;
        return admin.auth().setCustomUserClaims(
            user.uid,
            {
                role : "user"
            }
        )
    }).then(() => {
        const userRef = db.collection("USERS").doc(req.user.uid)
        return userRef.set({
            ...inputs,
            role:"user",
            isExist : true,
            createdAt : admin.firestore.FieldValue.serverTimestamp(),
            id : req.user.uid
        }).then(() => {
            return res.send("User created successfully")
        }).catch((err) => {
            console.log(err)
            return res.send("Failed to create User")
        })
    })
})

exports.api = functions.https.onRequest(app)

