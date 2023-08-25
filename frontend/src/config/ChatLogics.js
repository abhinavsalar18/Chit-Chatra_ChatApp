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
    // console.log("loggedUser", loggedUser);
    // console.log("users", users);

    if (users && users.length >= 2) {
      return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    console.log("getSenderFull function unable to return the user");
    return "";
  };

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined ) &&
        messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id 
    );
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };


  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

module.exports = {getSender, getSenderFull, isSameSender, isLastMessage, isSameSenderMargin};  