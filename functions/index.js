const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// /A/ https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const { log } = require("firebase-functions/logger");
const app = express();

const cors = require("cors")({ origin: true });
app.use(cors);

const anonymousUser = {
  id: "anon",
  name: "Anonymous",
  avatar: "",
};

const checkUser = (req, res, next) => {
  req.user = anonymousUser;
  if (req.query.auth_token !== undefined) {
    let idToken = req.query.auth_token;
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedIdToken) => {
        let authUser = {
          id: decodedIdToken.user_id,
          name: decodedIdToken.name,
          avatar: decodedIdToken.picture,
        };
        req.user = authUser;
        next();
      })
      .catch((error) => {
        next();
      });
  } else {
    next();
  }
};

app.use(checkUser);

function createChannel(cname) {
  let channelsRef = admin.database().ref("channels");
  let date1 = new Date();
  let date2 = new Date();
  date2.setSeconds(date2.getSeconds() + 1);
  const defaultData = `{
        "messages" : {
            "1" : {
                "body" : "Welcome to #${cname} channel!",
                "date" : "${date1.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            },
            "2" : {
                "body" : "첫 번째 메시지를 보내 봅시다.",
                "date" : "${date2.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            }
        }
    }`;
  channelsRef.child(cname).set(JSON.parse(defaultData));
}

app.post("/channels", (req, res) => {
  let cname = req.body.cname; //req 는 데이터 {"cname": "general"} body={} cname은 general를 가르킨다
//   console.log(cname); //log찍어보면 general 이 콘솔창에 나온다.
  createChannel(cname); // 채널생성!
  res.header("Content-Type", "application/json; charset=utf-8"); //헤더
  res.status(201).json({ result: "oksssssssssss" }); //!보내기
});

app.get("/channels", (req, res) => {
  let channelsRef = admin.database().ref("channels");
//   console.log(channelsRef);  //데이터베이스에 관련된 모든정보?
  channelsRef.once("value", function (snapshot) {//오브젝트를 인수로
    // console.log("  :"+snapshot);
    let items = new Array(); //배열로 아이템 선언!
    snapshot.forEach(function (childSnapshot) { // forEach 반복문으로 
      let cname = childSnapshot.key; // cname에 데이터 베이스의 이름을 저장
      items.push(cname); // items에 push cname 즉 삽입. 배열형태로~
    });
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ channels: items }); //!보내기
  });
});

//아마도 데이터 베이스에 지정채널에서 메세지를 보내는? post api
app.post("/channels/:cname/messages", (req, res) => {
  let cname = req.params.cname;
  let message = {
    date: new Date().toJSON(),
    body: req.body.body,
    user: req.user,
  };
  let messagesRef = admin.database().ref(`channels/${cname}/messages`);
  messagesRef.push(message);
  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(201).send({ result: "ok" });
});
//메세지를 배열로 받는 그리고 reverse로 최신순으로 정렬
app.get("/channels/:cname/messages", (req, res) => {
  let cname = req.params.cname;
  let messagesRef = admin
    .database()
    .ref(`channels/${cname}/messages`)
    .orderByChild("date")
    .limitToLast(20);
  messagesRef.once("value", function (snapshot) {
    let items = new Array();
    snapshot.forEach(function (childSnapshot) {
      let message = childSnapshot.val();
      message.id = childSnapshot.key;
      items.push(message);
    });
    items.reverse();
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ messages: items });
  });
});
// 채널을 재생성해서 내부 메세지를 초기화 시킨다.!
app.post("/reset", (req, res) => {
  createChannel("general");
  createChannel("random");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(201).send({ result: "ok" });
});

exports.v1 = functions.https.onRequest(app);