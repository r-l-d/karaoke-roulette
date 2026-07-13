import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: theme.spacing(0.5)
    },
    chip: {
        margin: theme.spacing(0.5)
    }
}));

export default function Chips(props) {
    const classes = useStyles();
    let setQuery = props.setQuery;
    let query = props.query;

    const videoId = useSelector(state => {
        return state.videoId;
    });

    const [chipData, setChipData] = React.useState([
        { key: 0, label: "1950s" },
        { key: 1, label: "1960s" },
        { key: 2, label: "1970s" },
        { key: 3, label: "1980s" },
        { key: 4, label: "1990s" },
        { key: 5, label: "2000s" },
        { key: 6, label: "2010s" },
        { key: 7, label: "Pop" },
        { key: 8, label: "Rock" },
        { key: 9, label: "Jazz" },
        { key: 10, label: "Broadway" },
        { key: 11, label: "Hip Hop" },
        { key: 12, label: "Country" },
        { key: 13, label: "Alternative" },
        { key: 14, label: "Rap" },
        { key: 15, label: "Indie" },
        { key: 16, label: "Disco" },
        { key: 17, label: "Reggae" },
        { key: 18, label: "Blues" },
        { key: 19, label: "Funk" },
        { key: 20, label: "Metal" },
        { key: 21, label: "R&B" }
    ]);

    const handleClick = input => {
        console.log("input", input);
        setQuery(query + " " + input.label);
        handleDelete(input);
    };

    const handleDelete = chipToDelete => {
        setChipData(chips =>
            chips.filter(chip => chip.key !== chipToDelete.key)
        );
    };

    if (videoId) {
        return null;
    }

    return (
        <Paper className={classes.root}>
            {chipData.map(data => {
                return (
                    <Chip
                        key={data.key}
                        label={data.label}
                        color="primary"
                        clickable
                        className={classes.chip}
                        onClick={() => handleClick(data)}
                    />
                );
            })}
        </Paper>
    );
}
