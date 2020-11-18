import AuthServices from "../../apis/modules/auth"

const state = {}
const mutations={
    DO_SOMETHING(){
        console.log("mutations")
    }
}
const getters={}
const actions={
    async login({commit},data) {
        try {
            const response = await AuthServices.login(data)
            console.log("Response");
            console.log(response)
            commit("DO_SOMETHING")
        } catch (error){
            console.log(error.response)
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}