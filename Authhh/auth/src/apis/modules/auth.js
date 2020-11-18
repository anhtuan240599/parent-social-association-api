
import Api from "../../apis"

export default {
    login(data) {
        return Api().post('users/login',{
            email: data.username,
            password: data.password
        })
    },
    register() {
        return Api().post('users/register')
    }
}