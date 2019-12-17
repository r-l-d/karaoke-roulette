import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("data from receiveFriendsWannabes action: ", data);
    return {
        type: "RECEIVE_FRIENDS",
        friends: data
    };
}

export async function getFavorites() {
    const { data } = await axios.get("/favorites");
    console.log("data from favorites action: ", data);
    return {
        type: "GET_FAVORITES",
        favorites: data
    };
}

export async function removeFavorite(id) {
    await axios.post("/remove-favorite/" + id);
    return {
        type: "REMOVE_FAVORITE",
        id
    };
}

export async function setPlaylist(songs) {
    console.log("playlist set. Songs: ", songs);
    return {
        type: "SET_PLAYLIST",
        songs
    };
}

export async function acceptFriendRequest(id) {
    await axios.post("/update-friendship/" + id, {
        buttonText: "Accept Friend Request"
    });
    console.log("accept friend request successful in actions");
    return {
        type: "ACCEPT_FRIEND",
        id
    };
}

export async function unfriend(id) {
    await axios.post("/update-friendship/" + id, {
        buttonText: ""
    });
    return {
        type: "REMOVE_FRIEND",
        id
    };
}

export async function chatMessages(msgs) {
    return {
        type: "GET_MESSAGES",
        msgs
    };
}

export async function chatMessage(newMsg) {
    console.log("chatmessage in actions: ", newMsg);
    return {
        type: "NEW_MESSAGE",
        newMsg
    };
}

export async function friendRequest(request) {
    console.log("friendRequest in actions: ", request);
    return {
        type: "FRIEND_REQUEST",
        request
    };
}

export async function getOtherFriends(id) {
    console.log("getotherFriends in Actions. ID: ", id);
    const { data } = await axios.get("/other-friends/" + id);

    return {
        type: "OTHER_FRIENDS",
        otherFriends: data
    };
}
