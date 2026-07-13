const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const cookieSession = require("cookie-session");
module.exports = app;
const csurf = require("csurf");
const request = require("request");
const MOCK_MODE = process.env.MOCK_MODE === "true";

const mockUserId = 1;
const mockUser = {
    id: 1,
    first: "Mock",
    last: "Singer"
};

const mockSongs = [
    {
        id: { videoId: "uXza21eCeOM" },
        snippet: {
            title: "Take On Me - Karaoke Version",
            channelId: "mock-channel-1",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/uXza21eCeOM/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "OPf0YbXqDm0" },
        snippet: {
            title: "Uptown Funk - Karaoke Lyrics",
            channelId: "mock-channel-2",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/OPf0YbXqDm0/default.jpg"
                }
            }
        }
    },
    {
        id: { videoId: "fJ9rUzIMcZQ" },
        snippet: {
            title: "Bohemian Rhapsody - Karaoke",
            channelId: "mock-channel-3",
            thumbnails: {
                default: {
                    url: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/default.jpg"
                }
            }
        }
    }
];

let mockFavorites = [
    {
        id: 1,
        video_id: "uXza21eCeOM",
        title: "Take On Me - Karaoke Version",
        image_url: "https://i.ytimg.com/vi/uXza21eCeOM/default.jpg",
        user_id: mockUserId
    }
];

function ensureMockSession(req) {
    if (!req.session.userId) {
        req.session.userId = mockUserId;
    }
}

app.use(compression());
app.use(express.static("./public"));
app.use(express.json());

app.use(
    cookieSession({
        secret: `SPICY food is the best`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    try {
        secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
    } catch (err) {
        if (MOCK_MODE) {
            secrets = {
                API_KEY2: "mock-key"
            };
        } else {
            throw err;
        }
    }
}

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", async (req, res) => {
    if (MOCK_MODE) {
        req.session.userId = mockUserId;
        return res.json({
            success: true
        });
    }
    const { first, last, email, password } = req.body;
    try {
        let hashedPass = await hash(password);
        let { rows } = await db.addUser(first, last, email, hashedPass);
        req.session.userId = rows[0].id;
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    if (MOCK_MODE) {
        req.session.userId = mockUserId;
        return res.json({
            success: true
        });
    }
    const { email, password } = req.body;
    try {
        let userInfo = await db.getPassword(email);
        let passCheck = await compare(password, userInfo.rows[0].password);
        if (passCheck) {
            req.session.userId = userInfo.rows[0].id;
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            success: false
        });
    }
});

app.get("/user.json", async (req, res) => {
    if (MOCK_MODE) {
        ensureMockSession(req);
        return res.json(mockUser);
    }
    try {
        const { userId } = req.session;
        let { rows } = await db.getUser(userId);
        res.json(rows[0]);
    } catch (err) {
        console.log(err);
    }
});

// app.get("/api/:query", function(req, res) {
//     let query = req.params.query;
//     // console.log("query: ", query);
//     const options = {
//         url: "https://www.googleapis.com/youtube/v3/search",
//         qs: {
//             part: "snippet",
//             q: query,
//             key: secrets.API_KEY,
//             videoEmbeddable: "true",
//             type: "video",
//             videoSyndicated: "true",
//             regionCode: "de"
//         }
//     };
//     console.log("options: ", options);
//     request(options, function(err, response, body) {
//         res.json(JSON.parse(body));
//     });
// });

app.get("/api/:query", function(req, res) {
    if (MOCK_MODE) {
        return res.json(mockSongs);
    }
    let query = req.params.query;
    // console.log("query: ", query);
    const options = {
        url: "https://www.googleapis.com/youtube/v3/search",
        qs: {
            part: "snippet",
            q: query,
            key: secrets.API_KEY2,
            videoEmbeddable: "true",
            type: "video",
            videoSyndicated: "true",
            regionCode: "de",
            maxResults: 1
        }
    };
    console.log("options: ", options);
    request(options, function(err, response, body) {
        const bodyParsed = JSON.parse(body);
        // console.log("bodyParsed ", bodyParsed.items[0].id.videoId);
        const videoId = bodyParsed.items[0].id.videoId;
        const options2 = {
            url: "https://www.googleapis.com/youtube/v3/search",
            qs: {
                part: "snippet",
                relatedToVideoId: videoId,
                key: secrets.API_KEY2,
                videoEmbeddable: "true",
                type: "video",
                videoSyndicated: "true",
                regionCode: "de",
                maxResults: 40
            }
        };

        request(options2, function(err, response, body) {
            const bodyParsed2 = JSON.parse(body);
            console.log("body2: ", bodyParsed2.items);
            let filteredResults = bodyParsed2.items.filter(
                item =>
                    item.snippet.channelId !== "UCYi9TC1HC_U2kaRAK6I4FSQ" &&
                    item.snippet.channelId !== "UCbqcG1rdt9LMwOJN4PyGTKg" &&
                    item.snippet.channelId !== "UCwTRjvjVge51X-ILJ4i22ew" &&
                    item.snippet.channelId !== "UCJ0uqCI0Vqr2Rrt1HseGirg" &&
                    (item.snippet.title.toLowerCase().includes("karaoke") ||
                        item.snippet.title.toLowerCase().includes("lyrics"))
            );
            console.log("filteredresults: ", filteredResults);
            res.json(filteredResults);
        });
    });
});

app.get("/api/more/:video_id", function(req, res) {
    if (MOCK_MODE) {
        return res.json(mockSongs.slice().reverse());
    }
    let videoId = req.params.video_id;
    console.log("morelikethis: ", videoId);
    const options = {
        url: "https://www.googleapis.com/youtube/v3/search",
        qs: {
            part: "snippet",
            relatedToVideoId: videoId,
            key: secrets.API_KEY2,
            videoEmbeddable: "true",
            type: "video",
            videoSyndicated: "true",
            regionCode: "de",
            maxResults: 40
        }
    };
    console.log("options: ", options);
    request(options, function(err, response, body) {
        const bodyParsed = JSON.parse(body);
        // console.log("morelike this body: ", bodyParsed2.items);
        let filteredResults = bodyParsed.items.filter(
            item =>
                item.snippet.channelId !== "UCYi9TC1HC_U2kaRAK6I4FSQ" &&
                item.snippet.channelId !== "UCbqcG1rdt9LMwOJN4PyGTKg" &&
                item.snippet.channelId !== "UCwTRjvjVge51X-ILJ4i22ew" &&
                item.snippet.channelId !== "UCJ0uqCI0Vqr2Rrt1HseGirg" &&
                (item.snippet.title.toLowerCase().includes("karaoke") ||
                    item.snippet.title.toLowerCase().includes("lyrics"))
        );
        console.log("morelikethis filteredresults: ", filteredResults);
        res.json(filteredResults);
    });
});

// app.post("/bio", async (req, res) => {
//     try {
//         const { userId } = req.session;
//         const { bio } = req.body;
//         await db.updateBio(bio, userId);
//         res.json({
//             bio: bio
//         });
//     } catch (err) {
//         console.log(err);
//     }
// });

app.get("/logout", function(req, res) {
    req.session.userId = null;
    res.redirect("/welcome");
});

app.get("/favorites", async (req, res) => {
    if (MOCK_MODE) {
        ensureMockSession(req);
        return res.json(
            mockFavorites.filter(favorite => favorite.user_id === req.session.userId)
        );
    }
    try {
        const id = req.session.userId;
        let { rows } = await db.getFavorites(id);
        res.json(rows);
    } catch (err) {
        console.log(err);
    }
});

app.post("/remove-favorite/:id", async (req, res) => {
    if (MOCK_MODE) {
        ensureMockSession(req);
        const favorite_id = Number(req.params.id);
        mockFavorites = mockFavorites.filter(favorite => favorite.id !== favorite_id);
        return res.json({
            notification: "Song Removed From Favorites"
        });
    }
    try {
        const favorite_id = req.params.id;
        await db.removeFavorite(favorite_id);
        res.json({
            notification: "Song Removed From Favorites"
        });
    } catch (err) {
        console.log(err);
    }
});

app.post("/add-favorite", async (req, res) => {
    if (MOCK_MODE) {
        ensureMockSession(req);
        const nextId =
            mockFavorites.reduce((maxId, favorite) => Math.max(maxId, favorite.id), 0) +
            1;
        const favorite = {
            id: nextId,
            video_id: req.body.currentVideoId,
            title: req.body.currentTitle,
            image_url: req.body.currentImage_Url,
            user_id: req.session.userId
        };
        mockFavorites.push(favorite);
        return res.json([favorite]);
    }
    try {
        // console.log("req.body: ", req.body);
        const video_id = req.body.currentVideoId;
        const title = req.body.currentTitle;
        const image_url = req.body.currentImage_Url;
        const user_id = req.session.userId;
        let { rows } = await db.addFavorite(
            video_id,
            title,
            image_url,
            user_id
        );
        res.json(rows);
    } catch (err) {
        console.log(err);
    }
});

app.get("*", function(req, res) {
    if (MOCK_MODE) {
        ensureMockSession(req);
    }
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});
