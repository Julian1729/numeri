import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';

import Wrapper from './Wrapper';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: '50px',
    right: '50px',
    color: theme.palette.common.white,
    backgroundColor: '#3F51B5',
  },
  box: {
    margin: '10px 0',
  },
}));

const CongregationPage = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Wrapper title="Roosevelt Congregation">
      <Box className={classes.box}>
        <Grid container spacing={1}>
          <Grid sm item>
            <Card>
              <CardContent>
                <Typography variant="h3" component="p">
                  143
                </Typography>
                <Typography variant="subtitle2">Publishers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sm item>
            <Card>
              <CardContent>
                <Typography variant="h3" component="p">
                  9
                </Typography>
                <Typography variant="subtitle2">Elders</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sm item>
            <Card>
              <CardContent>
                <Typography variant="h3" component="p">
                  6
                </Typography>
                <Typography variant="subtitle2">
                  Ministerial Servants
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid sm item>
            <Card>
              <CardContent>
                <Typography variant="h3" component="p">
                  18
                </Typography>
                <Typography variant="subtitle2">Regular Pioneers</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.box}>
        <Typography variant="h5" component="h5">
          Visits
        </Typography>
        <Paper outlined>
          <List>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="April 7, 2020 - April 14, 2020"
                secondary="October - May"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="April 7, 2020 - April 14, 2020"
                secondary="October - May"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="April 7, 2020 - April 14, 2020"
                secondary="October - May"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="April 7, 2020 - April 14, 2020"
                secondary="October - May"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="April 7, 2020 - April 14, 2020"
                secondary="October - May"
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Box>
      <Zoom
        key="primary"
        in={true}
        timeout={{
          enter: theme.transitions.duration.enteringScreen,
          exit: theme.transitions.duration.leavingScreen,
        }}
        unmountOnExit
      >
        <Fab aria-label="Add" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Zoom>
    </Wrapper>
  );
};

export default CongregationPage;
