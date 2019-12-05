import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import MenuAppBar from "./appbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            });
    }

    handleChange(inputElement) {
        this.setState({
            [inputElement.name]: inputElement.value
        });
    }

    render() {
        return (
            <div>
                <MenuAppBar />
                <Typography variant="h4">Login</Typography>
                {this.state.error && (
                    <div className="error">Oops! Something went wrong.</div>
                )}
                <TextField
                    required
                    name="email"
                    label="Email"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e.target)}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e.target)}
                />

                <Button
                    onClick={e => this.submit(e)}
                    color="primary"
                    variant="contained"
                >
                    SUBMIT
                </Button>
                <Button variant="contained" href="/">
                    To Register
                </Button>
            </div>
        );
    }
}