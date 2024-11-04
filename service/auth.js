// parking wale ki dairy ha yeh 

const sessionIdtoUserMap = new Map();

function setUser(id, user){
    sessionIdtoUserMap.set(id,user);
}
function getUser(id){
    return sessionIdtoUserMap.get(id);
}

module.exports= {
    setUser,
    getUser,
};