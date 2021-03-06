var db = require("../db");
var shortid = require("shortid");

// User List

module.exports.index = function(req, res) {
  var size = db.get("users").value().length;
  var page = parseInt(req.query.page) || 1;
  var minPage = 3;
  var perPage = 8;
  var totalPage = parseInt(size / perPage);
  if (totalPage > minPage) minPage = totalPage;
  var drop = (page - 1) * perPage;
  res.render("users/index", {
    users: db
      .get("users")
      .drop(drop)
      .take(perPage)
      .value(),
    page: page,
    minPage: minPage
  });
};

// Create user

module.exports.create = function(req, res) {
  res.render("users/create");
};

module.exports.postCreate = function(req, res) {
  req.body.id = shortid.generate();
  req.body.isAdmin = false;
  db.get("users")
    .push(req.body)
    .write();
  res.redirect("/users");
};

// Search user

module.exports.search = function(req, res) {
  var q = req.query.q;
  // Get data from db
  var userList = db.get("users").value();
  // Filter by query
  var matchedUsers = userList.filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render("users/index", {
    users: matchedUsers
  });
};

// Get user info

module.exports.get = function(req, res) {
  var id = req.params.id;
  var user = db
    .get("users")
    .find({ id: id })
    .value();
  res.render("users/detail", {
    user: user
  });
};

// Delete user

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get("users")
    .remove({ id: id })
    .write();
  res.redirect("/users");
};

// Update user

module.exports.update = function(req, res) {
  var id = req.params.id;
  var user = db
    .get("users")
    .find({ id: id })
    .value();
  res.render("users/update", {
    user: user
  });
};

module.exports.postUpdate = function(req, res) {
  var id = req.params.id;
  var newName = req.body.name;
  var newUrl = req.body.avatarUrl;
  var newEmail = req.body.email;
  var newPhone = req.body.phone;
  db.get("users")
    .find({ id: id })
    .assign({ name: newName })
    .assign({ avatarUrl: newUrl })
    .assign({ email: newEmail })
    .assign({ phone: newPhone })
    .write();
  res.redirect("/users");
};
