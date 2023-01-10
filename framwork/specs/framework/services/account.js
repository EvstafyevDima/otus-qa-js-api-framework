import supertest from "supertest";

import config from "../config/config";
const {url} = config
const {userId} = config

//let token = ''
//let userId = ''
const account = {

    authorized: (payload) => {
        return supertest(url)
            .post('/v1/Authorized')
            .set('Content-Type', 'application/json')
            .send(payload)
    },

    userUUID: (userId, token) => {
        return supertest(url)
            .get('/v1/User/' +userId)
            .set('Authorization', `Bearer ${token}`)
    },

    user: (payload) => {
        return supertest(url)
            .post('/v1/User')
            .send(payload);
    },

    deleteUser: (userID, token) => {
        return supertest(url)
            .delete('/v1/User/' +userID)
            .set('Authorization', `Bearer ${token}`)
    },

    async getDeleteUser() {
        const res = await this.deleteUser()
        return res.body.token
    },

    GenerateToken: (payload) => {
        return supertest(url)
            .post('/v1/GenerateToken')
            .send(payload)
    },

    async getToken() {
        const payload = config.credentials
        const res = await this.GenerateToken(payload)
        return res.body.token
    },

    async getAuthTokenWithCache() {
        if(token){
            return token;
        }
        token = await this.getToken()
        return token
    }
}

export default account