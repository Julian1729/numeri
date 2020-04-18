import React, { useState } from 'react';
// import { connect } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Wrapper from './Wrapper';

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

const data = [
  {
    name: 'October',
    months: ['October', 'May'],
    'Last Visit': 4000,
    'This Visit': 2400,
    amt: 2400,
  },
  {
    name: 'November',
    months: ['November', 'June'],
    'Last Visit': 3000,
    'This Visit': 1398,
    amt: 2210,
  },
  {
    name: 'December',
    months: ['December', 'July'],
    'Last Visit': 2000,
    'This Visit': 9800,
    amt: 2290,
  },
  {
    name: 'January',
    months: ['January', 'August'],
    'Last Visit': 2780,
    'This Visit': 3908,
    amt: 2000,
  },
  {
    name: 'February',
    months: ['February', 'September'],
    'Last Visit': 1890,
    'This Visit': 4800,
    amt: 2181,
  },
  {
    name: 'March',
    months: ['March', 'October'],
    'Last Visit': 2390,
    'This Visit': 3800,
    amt: 2500,
  },
  {
    name: 'April',
    months: ['April', 'November'],
    'Last Visit': 3490,
    'This Visit': 4300,
    amt: 2100,
  },
];

const CustomizedTick = props => {
  console.log(props);
  return (
    <>
      {/* <p>{props.data.months[0]}</p> */}
      {/* <p>{props.data.months[1]}</p> */}
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
        {props.payload.value}
      </text>
    </>
  );
};

const congregationBreakdown = [
  { name: 'Elders', value: 1000 },
  { name: 'Regular Pioneers', value: 3568 },
  { name: 'Unbaptized Publishers', value: 2989 },
  { name: 'Ministerial Servants', value: 2905 },
];

const VisitPage = props => {
  const theme = useTheme();
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Wrapper title="Roosevelt Congregation">
      <Typography component="h3" variant="h3">
        In the last 6 months
      </Typography>
      <Paper className={classes.root} outlined>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Stats" />
          <Tab label="Publishers" />
          <Tab label="Import" />
        </Tabs>
      </Paper>
      {/* Data Panel */}
      <TabPanel tabIndex={tabIndex} index={0}>
        <Paper className={fixedHeightPaper}>
          <Typography variant="h6">Hours compared to last visit</Typography>
          <ResponsiveContainer>
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={<CustomizedTick />} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="This Visit"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="Last Visit" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        {/* Cards */}
        <Box my={3}>
          <Grid container spacing={1} m={3}>
            <Grid sm item>
              <Card>
                <CardContent>
                  <Typography variant="h1" component="p">
                    5,000
                  </Typography>
                  <Typography variant="subtitle1">Total Hours</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid sm item>
              <Card>
                <CardContent>
                  <Typography variant="h1" component="p">
                    10.2
                  </Typography>
                  <Typography variant="subtitle1">Hourly Average</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid sm item>
              <Card>
                <CardContent>
                  <Typography variant="h1" component="p">
                    103%
                  </Typography>
                  <Typography variant="subtitle1">Meeting Attendace</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* Pie Chart */}
        <Paper className={fixedHeightPaper}>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={congregationBreakdown}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </Paper>
      </TabPanel>
      {/* Publisher Card Panel  */}
      <TabPanel tabIndex={tabIndex} index={1}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item>
            <Paper outlined>
              <List>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText>Hernandez, Julian</ListItemText>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid className={classes.root} item>
            <Paper className={classes.paper} outlined>
              <form>
                {/* Name */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="First Name"
                      name="firstName"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Last Name"
                      name="lastName"
                    />
                  </Grid>
                </Grid>
                {/* Gender, Apointment Baptized */}
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Pioneer</FormLabel>
                  <FormGroup>
                    <Grid container>
                      <Grid item sm={4}>
                        <FormControlLabel
                          control={<Checkbox name="regular" />}
                          label="Regular"
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <FormControlLabel
                          control={<Checkbox name="special" />}
                          label="Special"
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <FormControlLabel
                          control={<Checkbox name="aux" />}
                          label="Continuous Aux"
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </FormControl>
              </form>
            </Paper>
          </Grid>
        </Grid>
        <Box my={3}>
          <Paper outlined>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Return Visits</TableCell>
                    <TableCell align="right">Placements</TableCell>
                    <TableCell align="right">Videos Shown</TableCell>

                    <TableCell align="right">Bible Studies</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      April
                    </TableCell>
                    <TableCell align="right">71</TableCell>
                    <TableCell align="right">3</TableCell>
                    <TableCell align="right">11</TableCell>
                    <TableCell align="right">3</TableCell>
                    <TableCell align="right">0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </TabPanel>
      {/* Import Panel */}
      <TabPanel tabIndex={tabIndex} index={2}>
        This is tab 3
      </TabPanel>
    </Wrapper>
  );
};

export default VisitPage;
