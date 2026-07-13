import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { useDispatch } from "react-redux";
import { addToQueue, playNow } from "./actions";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

// const useStyles = makeStyles({
//     image: {
//         height: 40
//     }
// });

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 2),
        margin: 10
    },
    image: {
        height: 70,
        width: 70
    },
    card: {
        width: 200,
        margin: 10
    },
    media: {
        height: 150
    },
    typography: {
        margin: 10
    },
    buttonBox: {
        display: "flex",
        justifyContent: "flex-start"
        // alignItems: "flex-end"
    }
}));

export function MoreResults() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const songs = useSelector(state => {
        return state.songs;
    });

    // console.log("props.results in MoreResults: ", props.results);
    // let songs = props.results;

    useEffect(() => {
        console.log("songs in more results:", songs);
    }, [songs]);
    //
    // const keyCheck = e => {
    //     if (e.key == "Enter") {
    //         // console.log("e.target.value: ", e.target.value);
    //         // console.log("e.key: ", e.key);
    //         e.target.value = "";
    //     }
    // };

    // console.log("chatMessages in Chat: ", chatMessages);
    if (!songs) {
        return null;
    }

    return (
        <div>
            <Container maxWidth="md">
                <Typography variant="h5">More Results</Typography>
                <Box display="flex" flexWrap="wrap">
                    {songs.slice(1).map(song => (
                        <Card key={song.id.videoId} className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    className={classes.media}
                                    image={song.snippet.thumbnails.default.url}
                                />
                            </CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="body1">
                                    {song.snippet.title}
                                </Typography>
                            </CardContent>

                            <CardActions className={classes.buttonBox}>
                                <Button
                                    size="small"
                                    onClick={e => dispatch(addToQueue(song))}
                                >
                                    Add to Queue
                                </Button>
                                <Button
                                    size="small"
                                    onClick={e =>
                                        dispatch(playNow(song.id.videoId))
                                    }
                                >
                                    Play Now
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Container>
        </div>
    );
}
