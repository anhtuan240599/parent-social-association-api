import request from "axios";
export default () => {
    return request.create({
        baseURL: process.env.VUE_APP_API
    });
};