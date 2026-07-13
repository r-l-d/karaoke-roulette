import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavorites, removeFavorite, playNow } from "./actions";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles(theme => ({
    // root: {
    //     padding: theme.spacing(1, 2),
    //     margin: 10
    // },
    // image: {
    //     height: 70,
    //     width: 70
    // },

    card: {
        // height: 200,
        width: 300,

        margin: 10,
        display: "flex"
    },
    // media: {
    //     height: 150
    // },
    // typography: {
    //     margin: 10
    // },
    // buttonBox: {
    //     display: "flex",
    //     justifyContent: "flex-start"
    // alignItems: "flex-end"

    details: {
        display: "flex",
        flexDirection: "column"
    },
    content: {
        flex: "1 0 auto"
    },
    cover: {
        width: 150
        // cover: "fit"
    },
    controls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    playIcon: {
        height: 30,
        width: 30
    }
}));

export default function Favorites() {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const favorites = useSelector(state => {
        return state.favorites;
    });

    useEffect(() => {
        dispatch(getFavorites());
    }, []);

    if (!favorites) {
        return null;
    }

    return (
        <div>
            <Typography className={classes.typography} variant="h6">
                Favorites ({favorites.length})
            </Typography>
            <Box display="flex" flexWrap="wrap">
                {favorites &&
                    favorites.map(favorite => (
                        <Card
                            raised="true"
                            key={favorite.id}
                            className={classes.card}
                        >
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography variant="body1">
                                        {favorite.title}
                                    </Typography>
                                </CardContent>
                                <div className="classes.controls">
                                    <IconButton
                                        color="primary"
                                        onClick={e =>
                                            dispatch(playNow(favorite.video_id))
                                        }
                                        aria-label="play/pause"
                                    >
                                        <PlayArrowIcon
                                            className={classes.playIcon}
                                        />
                                    </IconButton>
                                    <IconButton
                                        onClick={e =>
                                            dispatch(
                                                removeFavorite(favorite.id)
                                            )
                                        }
                                    >
                                        <HighlightOffIcon
                                            className={classes.playIcon}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                            <CardMedia
                                className={classes.cover}
                                image={favorite.image_url}
                            />
                        </Card>
                    ))}
            </Box>
        </div>
    );
}

// <Box display="flex" flexWrap="wrap">
// {favorites.map(favorite => (
//     <Card key={favorite.id} className={classes.card}>
//     <CardActionArea>
//     <CardMedia
//     component="img"
//     className={classes.media}
//     image={favorite.image_url}
//     />
//     </CardActionArea>
//     <CardContent>
//     <Typography gutterBottom variant="h6">
//     {favorite.title}
//     </Typography>
//     </CardContent>
//     <CardActions className={classes.buttonBox}>
//     <Button
//     size="small"
//     onClick={e =>
//         dispatch(
//             removeFavorite(favorite.id)
//         )
//     }
//     >
//     Remove
//     </Button>
//     </CardActions>
//     </Card>
// ))}
//
// </Box>
//
// <Button
// size="small"
// onClick={e =>
//     dispatch(addToQueue(favorite))
// }
// >
// Add to Queue
// </Button>

//
//
// <img
// className={classes.image}
// src={favorite.image_url}
// />
// </div>
// <div className={classes.paperComponent}>
// <div>
// </div>
// </div>
// <Box display="flex" flexDirection="column">
//
// <Button
// size="small"
// onClick={e =>
//     dispatch(
//         playNow(favorite.video_id)
//     )
// }
// >
// Play Now
// </Button>
// </Box>
// </Box>
// </Paper>
