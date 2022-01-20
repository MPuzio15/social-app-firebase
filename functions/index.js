require("dotenv").config();
// const firebase = require("firebase/app").default;
// require("firebase/auth");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();
// const firebaseConfig = {
//   apiKey: "AIzaSyD7Q-NYiIISP0TNTbCq6maTYpGAZU_D3-c",
//   authDomain: "socialapp-531e1.firebaseapp.com",
//   projectId: "socialapp-531e1",
//   storageBucket: "socialapp-531e1.appspot.com",
//   messagingSenderId: "386573971942",
//   appId: "1:386573971942:web:fc0d0aae906f76fb292627",
//   measurementId: "G-2ENSZXL3EW",
// };
// firebase.initializeApp(firebaseConfig);

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };

// exports.getComments = functions.https.onRequest((req, res) => {
//   admin
//     .firestore()
//     .collection("comments")
//     .get()
//     .then((data) => {
//       let comments = [];
//       data.forEach((el) => {
//         comments.push(el.data());
//       });
//       return res.json(comments);
//     })
//     .catch((err) => console.error(err));
// });

app.get("/comments", (req, res) => {
  admin
    .firestore()
    .collection("comments")
    .get()
    .then((data) => {
      let comments = [];
      data.forEach((el) => {
        comments.push({
          commentId: el.id,
          body: el.data().body,
          createdAt: el.data().createdAt,
          userHandle: el.data().userHandle,
          createdAt: el.data().createdAt,
        });
      });
      return res.json(comments);
    })
    .catch((err) => {
      console.error(err);
    });
});

// exports.addComment = functions.https.onRequest((req, res) => {
//   if (req.method !== "POST") {
//     return res.status(400).json({ error: "incorrect method used" });
//   }

//   const newComment = {
//     body: req.body.body,
//     userHandle: req.body.userHandle,
//     createdAt: admin.firestore.Timestamp.fromDate(new Date()),
//   };

//   admin
//     .firestore()
//     .collection("comments")
//     .orderBy("createdAt", "desc")
//     .add(newComment)
//     .then((el) => {
//       res.json({ message: `Document ${el.id} has been created succesfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Something went wrong" });
//       console.error(err);
//     });
// });

app.post("/comment", (req, res) => {
  const newComment = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };
  admin
    .firestore()
    .collection("comments")
    .add(newComment)
    .then((doc) => {
      res.json({
        message: `Documnet ${doc.id} has been successfully created.`,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

// signup route

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPasword: req.body.confirmPasword,
    handle: req.body.handle,
  };

  // TODO: validate data

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `User ${data.user.uid} signed up successfully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: `User could not be created.` });
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
