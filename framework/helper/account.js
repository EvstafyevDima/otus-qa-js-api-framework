import supertest from "supertest";

import config from "../config/config";

//let token = ''
//let userId = ''

const account = {


    createUser: (payload) => {
        return supertest(config.baseURL)
            .post('/Account/v1/User')
            .send(payload);
    },

    deleteUser: (userID, token) => {
        return supertest(config.baseURL)
            .delete('/Account/v1/User/' +userID)
            .set('Authorization', `Bearer ${token}`)
    },

    generateToken: (payload) => {
        return supertest(config.baseURL)
            .post('/Account/v1/GenerateToken')
            .send(payload)
    }

}

export default account