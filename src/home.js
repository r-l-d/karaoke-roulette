import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Friendshipbutton from "./friendshipbutton";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Video from "./video";
import { MoreResults } from "./more-results";
import Favorites from "./favorites";
import IframePlayer from "./iframePlayer";
import { useDispatch, useSelector } from "react-redux";
import Queue from "./queue";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
    getFavorites,
    removeFavorite,
    setPlaylist,
    playNow
} from "./actions";

const useStyles = makeStyles({
    card: {
        width: 200,
        margin: 10
    },
    media: {
        height: 140
    },
    typography: {
        margin: 10
    },
    buttonBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    searchField: {
        width: "70%",
        marginTop: 10,
        marginLeft: "15%"
    },
    videoPlayer: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto"
    }
});

export default function Home() {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [songs, setSongs] = useState([]);
    const [videoId, setVideoId] = useState("");
    const dispatch = useDispatch();

    // const songs = useSelector(state => state && state.songs);

    // useEffect(() => {
    //     let ignore = false;
    //     (async () => {
    //         console.log("query: ", query);
    //         const { data } = await axios.get(`/api/users/${query}`);
    //         if (!ignore) {
    //             console.log("users data: ", data);
    //             setUsers(data);
    //         } else {
    //             alert("Ignored!");
    //         }
    //     })();
    //     return () => (ignore = true);
    // }, [query]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            // console.log("e.target.value: ", e.target.value);
            // console.log("e.key: ", e.key);
            submit();
            e.target.value = "";
        }
    };

    async function submit() {
        try {
            // console.log("clicked on the button: ", query);
            const { data } = await axios.get(`/api/${query}`);
            // console.log("data in home.js: ", data.items[0].id.videoId);
            dispatch(setPlaylist(data.items));
            console.log("data.items: ", data.items);
            dispatch(playNow(data.items[0].id.videoId));
            // setSongs(data.items);
            // setVideoId(data.items[0].id.videoId);
        } catch (err) {
            console.log(err);
        }
        // .then(resp => {
        //     setButtonText(resp.data.buttonText);
        //     if (resp.data.buttonText == "Cancel Friend Request") {
        //         console.log(
        //             "new friend request received for: ",
        //             props.otherId
        //         );
        //     }
        // });
    }

    if (!songs) {
        return null;
    }

    return (
        <div>
            <Container maxWidth="lg">
                <div>
                    <TextField
                        className={classes.searchField}
                        label="Roulette"
                        variant="outlined"
                        onChange={e => setQuery(e.target.value + " karaoke")}
                        onKeyUp={keyCheck}
                        placeholder="Enter Artist or Song"
                    />
                    <Button onClick={submit}>Go</Button>
                </div>
                <Favorites />

                <IframePlayer
                    className={classes.videoPlayer}
                    // videoId={videoId}
                />

                <Queue />
                {/* {videoId && <Video videoId={videoId} songs={songs} />} */}
                <MoreResults />
            </Container>
        </div>
    );
}

// <Typography className={classes.typography} variant="h4">
//     Welcome page
// </Typography>
