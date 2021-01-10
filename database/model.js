const fs = require("fs")
const userPath = './database/users.json'


module.exports = class User {
    constructor(){
        this.usersDB =  JSON.parse(fs.readFileSync(userPath, 'utf8'))
    }
    
    writeToFile = (data) => {
        fs.writeFileSync(userPath,JSON.stringify(data, null, 2));
    }

    updateById = (userId , newUserInfo) => {

        const newUsersList = this.usersDB.map((user) =>
        user.userId == userId ? { ...newUserInfo } : user
    );
    
        this.writeToFile(newUsersList)
        return newUsersList
    }

    findById = (userId) => {
        if (!userId){
            {}
        } else {
            const user = this.usersDB.find(user => user.userId === userId)
            return user
        }
    }
}