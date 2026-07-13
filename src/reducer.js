export default function reducer(
    state = {
        ...state,
        queue: []
    },
    action
) {
    // console.log("state in reducer: ", state);
    if (action.type == "GET_FAVORITES") {
        state = {
            ...state,
            favorites: action.favorites
        };
    }

    if (action.type == "REMOVE_FAVORITE") {
        state = {
            ...state,
            favorites: state.favorites.filter(favorite => {
                if (favorite.id == action.id) {
                    return false;
                } else {
                    return true;
                }
            })
        };
    }

    if (action.type == "SET_PLAYLIST") {
        state = {
            ...state,
            songs: action.songs
        };
    }

    if (action.type == "GET_QUEUE") {
        state = {
            ...state
        };
    }

    if (action.type == "ADD_TO_QUEUE") {
        if (action.song.id.videoId) {
            let song = {
                video_id: action.song.id.videoId,
                title: action.song.snippet.title,
                image_url: action.song.snippet.thumbnails.default.url
            };
            state = {
                ...state,
                queue: state.queue.concat(song)
            };
        } else {
            state = {
                ...state,
                queue: state.queue.concat(action.song)
            };
        }
    }

    if (action.type == "PLAY_NOW") {
        state = {
            ...state,
            videoId: action.video_id
        };
    }

    if (action.type == "REMOVE_FROM_QUEUE") {
        state = {
            ...state,
            queue: state.queue.filter(song => {
                if (song.video_id == action.video_id) {
                    return false;
                } else {
                    return true;
                }
            })
        };
    }

    if (action.type == "ADD_FAVORITE") {
        state = {
            ...state,
            favorites: state.favorites.concat(action.data)
        };
    }

    // console.log("state after reducer: ", state);
    return state;
}
