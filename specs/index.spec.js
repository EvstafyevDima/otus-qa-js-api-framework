import supertest from "supertest";
import { faker } from '@faker-js/faker';
import { matchers } from 'jest-json-schema';
import config from'../framework/config/config'
import account from'../framework/helper/account'
import { generateUser } from '../framework/utils/generate-user'
import bookstore from "../framework/helper/bookStore";

describe('bookStore', () => {

  let userID = ''
  let token = ''

  beforeEach(async () => {

    const user = generateUser();
    const createUser = await account.createUser(user);  // Создание юзера
    userID = createUser.body.userID
    const generateToken = await account.generateToken(user); // получение токена
    token = generateToken.body.token


    //console.log(createUser.status, "createUser")
    //const reqData = JSON.parse(JSON.stringify(createUser)).req;
    //console.log(reqData, "reqData createUser")


    //console.log(generateToken.status, "generateToken")
    //const reqData2 = JSON.parse(JSON.stringify(generateToken)).req;
    //console.log(reqData2, "reqData2 generateToken")
});

  afterEach(async () => {

    const deleteLinkingBookToUser = await bookstore.deleteLinkingBooksToUser(token, userID);
    const deleteUser = await account.deleteUser(token, userID);
    //console.log(deleteLinkingBookToUser.status)
    //const reqData = JSON.parse(JSON.stringify(deleteLinkingBookToUser)).req;
    //console.log(reqData)
    //expect(deleteLinkingBookToUser.status).toEqual(204);

});

  describe('POST BookStore/v1/Books', () => {
    test("Привязка юзера к книжке", async () => {

      const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
      expect(linkingBookToUser.status).toEqual(201);

      const reqData = JSON.parse(JSON.stringify(linkingBookToUser)).req;
      //console.log(linkingBookToUser.body, "linkingBookToUser");
      //console.log(reqData, "linkingBookToUserReqData");

   })
   test("Повторная привязка юзера к книжке", async () => {

    const linkingBookToUser1 = await bookstore.linkingBookToUser(token, userID, config.isbn);
    const linkingBookToUser2 = await bookstore.linkingBookToUser(token, userID, config.isbn);

    expect(linkingBookToUser2.status).toEqual(400);
    expect(linkingBookToUser2.body).toEqual({
      "code": "1210",
      "message": "ISBN already present in the User's Collection!"
    });
    //const reqData = JSON.parse(JSON.stringify(linkingBookToUser1)).req;
    //console.log(linkingBookToUser2.body, "linkingBookToUser2.body");
    //console.log(reqData);
    //console.log(linkingBookToUser1);

 }) 
  test("Неправильный isbn", async () => {

    const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, '787778777');

    expect(linkingBookToUser.status).toEqual(400);
    expect(linkingBookToUser.body).toEqual({
      "code": "1205",
      "message": "ISBN supplied is not available in Books Collection!"
    });
    //const reqData = JSON.parse(JSON.stringify(linkingBookToUser1)).req;
    //console.log(linkingBookToUser2.body, "linkingBookToUser2.body");
    //console.log(reqData);
    //console.log(linkingBookToUser1);

  }) 
  
  test("Неправильный userID", async () => {

    const linkingBookToUser = await bookstore.linkingBookToUser(token, "74784844547454", config.isbn);

    expect(linkingBookToUser.status).toEqual(401);
    expect(linkingBookToUser.body).toEqual({
      "code": "1207",
      "message": "User Id not correct!"
    });
    //const reqData = JSON.parse(JSON.stringify(linkingBookToUser1)).req;
    //console.log(linkingBookToUser2.body, "linkingBookToUser2.body");
    //console.log(reqData);
    //console.log(linkingBookToUser1);

  }) 
  })
  describe('PUT BookStore/v1/Books', () => {

    beforeEach(async () => {
      const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
  });

    test("Обновление привязки юзера и книжки", async () => {

      //const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
      const updateLinkingBookToUser = await bookstore.updateLinkingBookToUser(token, userID, config.isbn, config.isbn2);
      expect(updateLinkingBookToUser.status).toEqual(200);
      expect(updateLinkingBookToUser.body.books[0].isbn).toEqual(config.isbn2);

      //const reqData = JSON.parse(JSON.stringify(linkingBookToUser)).req;

   })

   test("Несуществующий config.isbn2", async () => {

    //const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
    const updateLinkingBookToUser = await bookstore.updateLinkingBookToUser(token, userID, config.isbn, "88787887878");
    expect(updateLinkingBookToUser.status).toEqual(400);
    expect(updateLinkingBookToUser.body).toEqual({"code": "1205", "message": "ISBN supplied is not available in Books Collection!"});

    //const reqData = JSON.parse(JSON.stringify(linkingBookToUser)).req;

 })

  test("Несуществующий userID", async () => {

    //const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
    const updateLinkingBookToUser = await bookstore.updateLinkingBookToUser(token, "78788787", config.isbn, config.isbn2);
    expect(updateLinkingBookToUser.status).toEqual(401);
    expect(updateLinkingBookToUser.body).toEqual({"code": "1207", "message": "User Id not correct!"});
  

    //const reqData = JSON.parse(JSON.stringify(linkingBookToUser)).req;

    })
  })
  describe('Delete BookStore/v1/Books', () => {

    beforeEach(async () => {
      const linkingBookToUser = await bookstore.linkingBookToUser(token, userID, config.isbn);
  });

      test("Удаление связи книги и юзера", async () => {

        const deleteLinkingBookToUser = await bookstore.deleteLinkingBookToUser(token, userID, config.isbn);
        expect(deleteLinkingBookToUser.status).toEqual(204);
        expect(deleteLinkingBookToUser.body).toEqual({});
   })
      test("Удаление несуществующей связи", async () => {

        const deleteLinkingBookToUser = await bookstore.deleteLinkingBookToUser(token, userID, '1117897');
        expect(deleteLinkingBookToUser.status).toEqual(400);
        expect(deleteLinkingBookToUser.body).toMatchSnapshot();
      })
    })
  })

  describe('GET BookStore/v1/Books', () => {

    test("поиск книги", async () => {

    const getBook = await bookstore.getBook(config.isbn)
    expect(getBook.status).toEqual(200);
    expect(getBook.body).toMatchSnapshot()
  })

    test("Поиск книги по неправильному isbn", async () => {

      const getBook = await bookstore.getBook("777787")
      expect(getBook.status).toEqual(400);
      expect(getBook.body).toMatchSnapshot()
  })
})

describe('GET Param BookStore/v1/Books', () => {

  [
    { isbn: config.isbn,  status: 200, bodyIsbn: config.isbn},
    { isbn: config.isbn2, status: 200, bodyIsbn: config.isbn2},
    { isbn: "88888",      status: 400, bodyIsbn: undefined},
   
].forEach(({isbn, status, bodyIsbn}) => {
    test( 'Парам тест', async() => {

      const getBook = await bookstore.getBook(isbn)
      
      //const reqData = JSON.parse(JSON.stringify(getBook)).req;
      //console.log(reqData)

      expect(getBook.status).toEqual(status);
      expect(getBook.body.isbn).toEqual(bodyIsbn)

    })
  })
}) 
