import React from "react";
import axios from "./axios";
import MenuAppBar from "./appbar";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./home";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            auth: true
        };
    }

    componentDidMount() {
        // console.log("app has mounted");
        axios
            .get("/user.json")
            .then(({ data }) => {
                console.log("data: ", data);
                this.setState({
                    first: data.first,
                    last: data.last
                });
                // console.log("this.state: ", this.state);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        if (!this.state.first) {
            return null;
        }
        return (
            <div>
                <MenuAppBar
                    firstname={this.state.first}
                    lastname={this.state.last}
                    auth={this.state.auth}
                />

                <BrowserRouter>
                    <div>
                        <Route exact path="/" render={() => <Home />} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
