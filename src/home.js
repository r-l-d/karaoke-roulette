import React, { useState } from "react";
import axios from "./axios";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Favorites from "./favorites";
import IframePlayer from "./iframePlayer";
import { useDispatch } from "react-redux";
import Chips from "./chips";
import CasinoIcon from "@material-ui/icons/Casino";

import { setPlaylist, playNow } from "./actions";

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
        // marginTop: 10,
        width: "100%"
    },
    videoPlayer: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto"
    },
    searchContainer: {
        marginTop: 30,
        marginBottom: 30
    },
    favoriteContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: 10
    }
});

export default function Home() {
    const classes = useStyles();
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState(false);

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
            setError(false);
            // console.log("clicked on the button: ", query);
            let { data } = await axios.get(`/api/${query} karaoke`);
            console.log("data in home.js: ", data);
            if (data.length == 0) {
                setError(true);
                return;
            }
            dispatch(setPlaylist(data));
            dispatch(playNow(data[0].id.videoId));
            setQuery("");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <Container maxWidth="lg">
                <div className={classes.searchContainer}>
                    <Grid
                        className={classes.searchContainer}
                        container
                        direction="row"
                        alignItems="center"
                        justify="center"
                        spacing={2}
                    >
                        <Grid item xs={9}>
                            <TextField
                                value={query}
                                className={classes.searchField}
                                label="Roulette"
                                variant="outlined"
                                onChange={e => setQuery(e.target.value)}
                                onKeyUp={keyCheck}
                                placeholder="Enter Artist, Song, Genre, etc."
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={submit}
                            >
                                <CasinoIcon />
                                GO
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                {error && (
                    <Grid container direction="row" justify="center">
                        <Grid item xs={4} display="flex" justify="center">
                            <Typography
                                variant="h6"
                                style={{ textAlign: "center" }}
                            >
                                NO RESULTS! Try a different search
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="center"
                    spacing={2}
                >
                    <Grid item xs={6}>
                        <Chips query={query} setQuery={setQuery} />
                    </Grid>

                    <IframePlayer className={classes.videoPlayer} />
                </Grid>
                <Grid container className={classes.favoriteContainer}>
                    <Grid item xs={10}>
                        <Favorites />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
