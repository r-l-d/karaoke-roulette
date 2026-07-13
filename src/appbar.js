import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    link: {
        underline: "none",
        margin: 10
    },
    menu: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    }
}));

export default function MenuAppBar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // console.log("props in appbar: ", props);
    // console.log("auth", props.auth);

    return (
        <div className={classes.root}>
            <AppBar color="primary" position="static">
                <Toolbar>
                    <Typography variant="h5" className={classes.title}>
                        <Link color="inherit" underline="none" href="/">
                            Karaoke Roulette
                        </Link>
                    </Typography>
                    {props.auth && (
                        <div>
                            <div className={classes.menu}>
                                <Typography
                                    className={classes.link}
                                    variant="h6"
                                >
                                    <Link
                                        color="inherit"
                                        underline="none"
                                        href="/logout"
                                    >
                                        Logout
                                    </Link>
                                </Typography>

                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                ></IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right"
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <a href="/logout">Log Out</a>
                                </Menu>
                            </div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
