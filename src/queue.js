import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playNow, removeFromQueue, getQueue } from "./actions";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 2),
        margin: 10
    },
    image: {
        height: 70,
        width: 70
    },
    gridContainer: {
        background: "lightgrey",
        height: 300,
        overflow: "scroll",
        // width: "25%",
        // minWidth: 300,
        border: 1,
        borderColor: "black"
    },
    paperComponent: {
        marginLeft: 10
    }
}));

export default function Queue() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const queue = useSelector(state => {
        return state.queue;
    });

    useEffect(() => {
        dispatch(getQueue());
        // console.log("queue in queue:", queue);
    }, [queue]);

    return (
        <div>
            <div>
                <Typography className={classes.typography} variant="h6">
                    Queue
                </Typography>
                <div className={classes.gridContainer}>
                    {queue &&
                        queue.map(song => (
                            <Paper
                                component="div"
                                display="flex"
                                className={classes.root}
                                key={song.video_id}
                            >
                                <Box display="flex" alignItems="center">
                                    <div>
                                        <img
                                            className={classes.image}
                                            src={song.image_url}
                                        />
                                    </div>
                                    <div className={classes.paperComponent}>
                                        <div>
                                            <Typography variant="body1">
                                                {song.title}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            size="small"
                                            onClick={e =>
                                                dispatch(
                                                    removeFromQueue(
                                                        song.video_id
                                                    )
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>

                                        <Button
                                            size="small"
                                            onClick={e => {
                                                dispatch(
                                                    playNow(song.video_id)
                                                );

                                                dispatch(
                                                    removeFromQueue(
                                                        song.video_id
                                                    )
                                                );
                                            }}
                                        >
                                            Play Now
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                </div>
            </div>
        </div>
    );
}
