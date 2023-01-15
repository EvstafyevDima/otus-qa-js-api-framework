import supertest from "supertest";

import config from "../config/config";

const bookstore = {


    linkingBookToUser: (token, userID, isbn) => {
        return supertest(config.baseURL)
            .post('/BookStore/v1/Books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: `${userID}`,
                collectionOfIsbns:[
                    {
                        isbn: `${isbn}`
                    }
                ]
            })			
    },
    deleteLinkingBooksToUser: (token, userID) => {
        return supertest(config.baseURL)
            .delete('/BookStore/v1/Books?UserId=' +userID)
            .set('Authorization', `Bearer ${token}`)			
    },

    deleteLinkingBookToUser: (token, userID, isbn) => {
        return supertest(config.baseURL)
            .delete('/BookStore/v1/Book')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: userID,
                isbn: isbn
              })			
    },
    
    updateLinkingBookToUser: (token, userID, isbn, isbn2) => {
        return supertest(config.baseURL)
            .put('/BookStore/v1/Books/' +isbn)
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: userID,
                isbn: isbn2
              })			
    },

    getBook: (isbn) => {
        return supertest(config.baseURL)
            .get('/BookStore/v1/Book?ISBN=' +isbn)			
    },
}

export default bookstore