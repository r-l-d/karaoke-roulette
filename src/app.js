import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Profile from "./profile";
import MenuAppBar from "./appbar";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import FindPeople from "./findpeople";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Friends from "./friends";
import { Chat } from "./chat";
import FriendRequest from "./friend-request";
import Home from "./home";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            auth: true
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.refreshBio = this.refreshBio.bind(this);
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

    toggleModal() {
        console.log("toggle modal is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    uploadImage(imgUrl) {
        console.log("i am a method in app");
        //this is how you get the modal away. Change uploaderIsVisible to the opposite
        //then set this.state.imgurl to the url that you get back
        this.setState({
            imgUrl: imgUrl,
            uploaderIsVisible: false
        });
    }

    refreshBio(bio) {
        this.setState({
            bio: bio
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
                        <Route path="/users" render={() => <FindPeople />} />
                        <Route exact path="/chat" component={Chat} />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" render={() => <Friends />} />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && <Dialog open={open}></Dialog>}
            </div>
        );
    }
}
