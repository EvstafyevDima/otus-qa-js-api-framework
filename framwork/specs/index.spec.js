import supertest from "supertest";
import config from "./framework/config/config";
import account from "./framework/services/account";


describe('account', () => {

  describe('POST /v1/Authorized', () => {
    

    test('Метод должен существовать', async () => {
      const res = await supertest('https://demoqa.com/Account')
          .post('/v1/Authorized')
          .send({})

      expect(res.status).not.toEqual(200);
    })

    test('Авторизация должна проходить успешно с правильным логином и паролем', async () => {
      
      const res = await account.authorized(config.credentials);
      
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(true)
    })

    test('Авторизация не проходит с неправильным логином', async () => {
      
      const res = await account.authorized({ userName: 'ццццц', password: 'evstafev$74445' });

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({ code: '1207', message: 'User not found!' })
    })
  })


  describe('GET /v1/Authorized', () => {

    test('Поиск юзера', async () => {

      const token = await account.getToken();
      const res = await account.userUUID(config.userId ,token);

      const reqData = JSON.parse(JSON.stringify(res)).req;
      expect(res.status).toEqual(200);
      expect(res.body.userId).toEqual(config.userId)
      expect(res.body.username).toEqual(config.credentials.userName)

    })

    test('Поиск несуществующего юзера', async () => {

      const token = await account.getToken();
      const res = await account.userUUID(config.nonExistUserId ,token);

      expect(res.status).toEqual(401);
      expect(res.body).toEqual({ code: '1207', message: 'User not found!' })

    })
  })


  describe('DELETE /v1/User/{UUID}', () => {

    let token = ''
    let userID = ''

    beforeAll(async () => {

      const res = await account.user({ userName: 'dem3oN885777798898899988879987', password: 'Dde2mo1111!' })
      const res2 = await account.GenerateToken({ userName: 'dem3oN885777798898899988879987', password: 'Dde2mo1111!' });
      userID = res.body.userID
      token = res2.body.token

});

    test('Удаление существующего юзера', async () => {
      
      const getDeleteUser = await account.deleteUser(userID, token);


      //const reqData = JSON.parse(JSON.stringify(getDeleteUser)).req;
      //console.log(reqData)
      expect(getDeleteUser.status).toEqual(204)
      expect(getDeleteUser.body).toEqual({})
      
    })


    test('Удаление несущуствующего юзера', async () => {
      
      const getDeleteUser = await account.deleteUser(config.nonExistUserId, token);
      //const reqData = JSON.parse(JSON.stringify(getDeleteUser)).req;
      //console.log(getDeleteUser.body)

      expect(getDeleteUser.status).toEqual(200)
      expect(getDeleteUser.body).toEqual({ code: '1207', message: 'User Id not correct!' })
      
    })
  })
})