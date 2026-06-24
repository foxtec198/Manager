import connect from '../config/request';

class AuthService{
    async login(mat, pwd){
        const res = await connect.post("/config/login", {mat:mat, pwd:pwd});
        if(res.statusText == "OK"){sessionStorage.setItem('token', res.data.access_token)};
        return res;
    };

    logout() {
        sessionStorage.clear();
    }
};

export default new AuthService();