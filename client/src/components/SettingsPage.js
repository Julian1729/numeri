import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Wrapper from './Wrapper';

const TabPanel = props => {
  const { children, tabIndex, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabIndex !== index}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabIndex === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: '100%',
  },
  fixedHeight: {
    height: 440,
  },
}));

const SettingsPage = () => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  return (
    <Wrapper>
      <Paper className={classes.root} outlined>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Account" />
          <Tab label="Circuit" />
        </Tabs>
      </Paper>
      <TabPanel tabIndex={tabIndex} index={0}>
        this here
      </TabPanel>
    </Wrapper>
  );
};

export default SettingsPage;
