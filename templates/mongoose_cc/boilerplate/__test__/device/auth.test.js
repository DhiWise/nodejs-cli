/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../../app');
const authConstant = require('../../constants/authConstant');
const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let insertedUser = {};

beforeAll(async function (){
  try {
    await client.connect();
    const dbInstance = client.db('Dhiwise_test');
    const user = dbInstance.collection('user');
    insertedUser = await user.insertOne({
      username: 'Catherine84',
      password: 'IhYi5durFev_AoU',
      email: 'Clare_OHara@hotmail.com',
      name: 'Mrs. Leslie Rosenbaum',
      userType: 780,
      mobileNo: '998.523.4361 x321',
      resetPasswordLink: {},
      loginRetryLimit: 269,
      loginReactiveTime: '2022-12-06T13:23:48.894Z',
      id: '62459586a18a020080e3f7c3'
    });
  }
  catch (error) {
    console.error(`we encountered ${error}`);
  }
  finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a user', async () => {
    let registeredUser = await request(app)
      .post('/device/auth/register')
      .send({
        'username':'Yolanda.Nikolaus31',
        'password':'yu7AX3XwBXqNgTx',
        'email':'Ray.Pfannerstill@gmail.com',
        'name':'Kelvin Konopelski',
        'userType':authConstant.USER_TYPES.User,
        'mobileNo':'835.306.4657 x2741',
        'addedBy':insertedUser.insertedId,
        'updatedBy':insertedUser.insertedId
      });
    expect(registeredUser.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
    expect(registeredUser.statusCode).toBe(200);
  });
});

describe('POST /login -> if username and password is correct', () => {
  test('should return user with authentication token', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Yolanda.Nikolaus31',
          password: 'yu7AX3XwBXqNgTx'
        }
      );
    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('SUCCESS');
    expect(user.body.data).toMatchObject({
      id: expect.any(String),
      token: expect.any(String)
    }); 
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /login -> if username is incorrect', () => {
  test('should return unauthorized status and user not exists', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'wrong.username',
          password: 'yu7AX3XwBXqNgTx'
        }
      );

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /login -> if password is incorrect', () => {
  test('should return unauthorized status and incorrect password', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Yolanda.Nikolaus31',
          password: 'wrong@password'
        }
      );

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /login -> if username or password is empty string or has not passed in body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.body.message).toBe('Insufficient parameters.');
    expect(user.statusCode).toBe(422);
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ email: '' });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.body.message).toBe('Insufficient parameters.');
    expect(user.statusCode).toBe(422);
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('RECORD_NOT_FOUND');
    expect(user.body.message).toBe('Record not found with specified criteria.');
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    const expectedOutputMessages = [
      'OTP successfully send.',
      'OTP successfully send to your email.',
      'OTP successfully send to your mobile number.'
    ];
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email':'Ray.Pfannerstill@gmail.com', });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('SUCCESS');
    expect(expectedOutputMessages).toContain(user.body.message);
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /validate-otp -> OTP is sent in request body and OTP is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Yolanda.Nikolaus31',
          password: 'yu7AX3XwBXqNgTx'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .post('/device/auth/validate-otp')
              .send({ 'otp': foundUser.body.data.resetPasswordLink.code, }).then(user => {
                expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(user.body.status).toBe('SUCCESS');
                expect(user.statusCode).toBe(200);
              });
          });
      });
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({ 'otp': '12334' });
    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('FAILURE');
    expect(user.statusCode).toBe(200);
    expect(user.body.message).toBe('Invalid OTP');
  });
});

describe('POST /validate-otp -> if request body is empty or OTP has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(422);
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Yolanda.Nikolaus31',
          password: 'yu7AX3XwBXqNgTx'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .put('/device/auth/validate-otp')
              .send({
                'code': foundUser.body.data.resetPasswordLink.code,
                'newPassword':'newPassword'
              }).then(user => {
                expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
                expect(user.body.status).toBe('SUCCESS');
                expect(user.statusCode).toBe(200);
              });
          });
      });
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(422);
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('FAILURE');
    expect(user.body.message).toBe('Invalid Code');
    expect(user.statusCode).toBe(200);
  });
});

afterAll(function (done) {
  db.connection.db.dropDatabase(function () {
    db.connection.close(function () {
      done();
    });
  });
});
