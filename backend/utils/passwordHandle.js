const bcrypt = require('bcrypt')


const hashPassword = async (password) => {
    const saltPassword = 10
    try {
        const hashedPassword = await bcrypt.hash(password, saltPassword)
        return hashedPassword
    }catch(error) {
        console.error('Error hashing password : ', error)
    }
}

const verifyPassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    if(isMatch){
        return true
    }else{
        return false
    }
}

module.exports = {
    hashPassword,
    verifyPassword
}