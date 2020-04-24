const _ = require('lodash');
const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const expect = chai.expect;
const { ObjectId } = require('mongodb');

const errors = require('../../Errors');
const users = require('../fixtures/users.fixture');
const circuits = require('../fixtures/circuit.fixture');
const circuitService = require('../../services/circuit.service');
const { circuitModel, userModel } = require('../../models');

describe('Circuit Service', () => {});
