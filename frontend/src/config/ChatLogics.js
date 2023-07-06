const getSender = (loggedUser, users) => {
    // console.log("loggedUser", loggedUser);
    // console.log("users", users);

    if (users && users.length >= 2) {
      return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }
    console.log("getSender function unable to return the user");
    return "";
  };

  
 const getSenderFull = (loggedUser, users) => {
    console.log("loggedUser", loggedUser);
    console.log("users", users);

    if (users && users.length >= 2) {
      return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    console.log("getSenderFull function unable to return the user");
    return "";
  };

module.exports = {getSender, getSenderFull};  