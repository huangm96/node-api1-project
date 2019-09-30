// implement your API here
const express = require("express");
const dbModel = require("./data/db.js");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Database is working!");
});

server.get("/api/users", (req, res) => {
  dbModel
    .find()
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  dbModel
    .findById(id)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

server.post("/api/users", (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    dbModel
      .insert(newUser)
      .then(user => {
        res.status(201).json(newUser);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  dbModel
    .remove(id)
    .then(user => {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The user could not be removed"
      });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    dbModel
      .update(id, changes)
        .then(user => {
            if (user) {
                res.status(200).json(changes);
            } else {
              res.status(404).json({
                message: "The user with the specified ID does not exist."
              });
          }
        
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`\n***API on port ${port}***\n`);
});
