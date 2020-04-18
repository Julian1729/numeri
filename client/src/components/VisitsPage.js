import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Wrapper from './Wrapper';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  populated: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function InteractiveList() {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState('date');

  const handleSortByChange = e => setSortBy(e.target.value);

  return (
    <Wrapper title="Visits">
      <Grid container justify="space-between" alignItems="center">
        <FormControl variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={handleSortByChange} label="Sort By">
            <MenuItem value="date" default>
              Date
            </MenuItem>
            <MenuItem value="congregation">Congregation</MenuItem>
            <MenuItem value="last_visit">Last Visit</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="subtitle1">Filters:</Typography>
        <FormControl variant="outlined">
          <InputLabel>Congregation</InputLabel>
          <Select value={sortBy} onChange={handleSortByChange} label="Filter">
            <MenuItem value="congregationId" default>
              All
            </MenuItem>
            <MenuItem value="congregationId">Roosevelt</MenuItem>
            <MenuItem value="congregationId">North English</MenuItem>
            <MenuItem value="congregationId">Pennypack</MenuItem>
            <MenuItem value="congregationId">Tacony</MenuItem>
            <MenuItem value="congregationId">East Mayfair</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <List>
        {generate(
          <Link to="/visits/:id">
            <ListItem button>
              <ListItemAvatar>
                <Avatar className={classes.populated}>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Roosevelt Congregation"
                secondary="Last Visit: October, 2020"
              />
              <ListItemText primary="May 7,2020 - May 13,2020" />
              {/* <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction> */}
            </ListItem>
          </Link>
        )}
      </List>
    </Wrapper>
  );
}
