const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const config = {
  realm: process.env.realm,
  realmPublicKey: process.env.realmPublicKey,
  authServerUrl: process.env.authServerUrl,
  clientId: process.env.clientId
};

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

const keycloak = new Keycloak(
  {
    store: memoryStore
  },
  config
);

app.use(keycloak.middleware());
app.get("/service/public", function(req, res) {
  res.json({ message: "public" });
});
app.get("/service/secured", keycloak.protect(), function(req, res) {
  res.json({ message: "secured" });
});
app.use("*", function(req, res) {
  res.send("Not found!");
});
app.listen(3001, function() {
  console.log("Started at port 3001");
});
