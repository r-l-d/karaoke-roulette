var spicedPg = require("spiced-pg");
const MOCK_MODE = process.env.MOCK_MODE === "true";

let mockUsers = [
    {
        id: 1,
        first: "Mock",
        last: "Singer",
        email: "mock@karaoke.local",
        password: "mock-password"
    }
];

let mockFavorites = [
    {
        id: 1,
        video_id: "uXza21eCeOM",
        title: "Take On Me - Karaoke Version",
        image_url: "https://i.ytimg.com/vi/uXza21eCeOM/default.jpg",
        user_id: 1
    }
];

var db = MOCK_MODE
    ? null
    : spicedPg(
          process.env.DATABASE_URL ||
              "postgres:postgres:postgres@localhost:5432/finalproject"
      );

exports.addUser = function addUser(first, last, email, password) {
    if (MOCK_MODE) {
        const id = mockUsers.length + 1;
        mockUsers.push({ id, first, last, email, password });
        return Promise.resolve({ rows: [{ id }] });
    }
    return db.query(
        "INSERT INTO users(first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getPassword = function getPassword(email) {
    if (MOCK_MODE) {
        const user = mockUsers.find(mockUser => mockUser.email === email);
        return Promise.resolve({ rows: user ? [user] : [] });
    }
    return db.query("SELECT password, id FROM users WHERE email=$1", [email]);
};

exports.getUser = function getUser(id) {
    if (MOCK_MODE) {
        const user = mockUsers.find(mockUser => mockUser.id == id);
        return Promise.resolve({ rows: user ? [user] : [] });
    }
    return db.query("SELECT first, last FROM users WHERE id=$1", [id]);
};

exports.getFavorites = function getFavorites(id) {
    if (MOCK_MODE) {
        return Promise.resolve({
            rows: mockFavorites.filter(favorite => favorite.user_id == id)
        });
    }
    return db.query("SELECT * FROM favorites WHERE user_id=$1", [id]);
};

exports.removeFavorite = function removeFavorite(id) {
    if (MOCK_MODE) {
        mockFavorites = mockFavorites.filter(favorite => favorite.id != id);
        return Promise.resolve({ rows: [] });
    }
    return db.query("DELETE FROM favorites WHERE id=$1", [id]);
};

exports.addFavorite = function addFavorite(
    video_id,
    title,
    image_url,
    user_id
) {
    if (MOCK_MODE) {
        const id = mockFavorites.length
            ? Math.max(...mockFavorites.map(favorite => favorite.id)) + 1
            : 1;
        const favorite = {
            id,
            video_id,
            title,
            image_url,
            user_id
        };
        mockFavorites.push(favorite);
        return Promise.resolve({
            rows: [
                {
                    id,
                    video_id,
                    title,
                    image_url
                }
            ]
        });
    }
    return db.query(
        "INSERT INTO favorites(video_id, title, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING id, video_id, title, image_url",
        [video_id, title, image_url, user_id]
    );
};
