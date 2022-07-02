let users = [];
const parkings = [];
const addUser = function({id, parking_id, slot_id}) {
    const user = {
        id,
        parking_id,
        slot_id
    }
    users.push(user);
    return user;
}
const removeUser = function(userId){
    var index = users.findIndex(user => user.id===userId);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
    return {
        error: 'User already exists'
    }
}

const getUser = function (id) {
    var user = users.find(user => user.id===id);
    if(!user){
        return {
            message: 'User not found',
        };
    }
    return user;
}

const getUsersInParking = function (parking_id) {
    var listUsers = users.filter(user => user.parking_id===parking_id);
    if(!listUsers) {
        return [];
    }
    return listUsers;
}

const changeSlot = function ({userId, parking_id, slot_id}) {
    const existSlot = users.find((user) => {
        return user.parking_id === parking_id && user.slot_id === slot_id;
    })
    if(existSlot === undefined) {
        users = users.filter(user => {
            if(user.id === userId){
                user.slot_id = slot_id;
                return user;
            }else{
                return user;
            }
        })
        return users;

    }else{
        return {
            message: "Vị trí đã được sử dụng!"
        }
    }
}

module.exports = {
    addUser,
    removeUser,
    getUsersInParking,
    getUser,
    changeSlot
}