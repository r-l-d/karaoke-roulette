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
    }
});

export default function FindPeople() {
    console.log("FindPeople is here");
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    useEffect(() => {
        let ignore = false;
        (async () => {
            console.log("query: ", query);
            const { data } = await axios.get(`/api/users/${query}`);
            if (!ignore) {
                console.log("users data: ", data);
                setUsers(data);
            } else {
                alert("Ignored!");
            }
        })();
        return () => (ignore = true);
    }, [query]);

    if (!users) {
        return null;
    }

    return (
        <div>
            <Container maxWidth="lg">
                <Typography className={classes.typography} variant="h4">
                    Find People
                </Typography>

                <TextField
                    label="Search"
                    variant="outlined"
                    onChange={e => setQuery(e.target.value)}
                />
                <div>
                    <Box display="flex" flexWrap="wrap">
                        {users.map(user => (
                            <Card key={user.id} className={classes.card}>
                                <CardActionArea>
                                    <Link to={`/user/${user.id}`}>
                                        <CardMedia
                                            className={classes.media}
                                            image={user.image_url}
                                        />
                                    </Link>
                                </CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5">
                                        {user.first} {user.last}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.buttonBox}>
                                    <Link to={`/user/${user.id}`}>
                                        <Button size="small" color="primary">
                                            See profile
                                        </Button>
                                    </Link>
                                    <Friendshipbutton
                                        size="small"
                                        otherId={user.id}
                                    />
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                </div>
            </Container>
        </div>
    );
}
