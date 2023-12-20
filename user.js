
const { Sequelize,DataTypes} = require('sequelize')
const kpssql = new Sequelize('kpsdatabase', 'root', 'yongkps', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});


async function CreateUserTable() {

    await User.sync(); // 使用 { force: true } 可以强制重新创建表
    console.log('Tables created!');

    // const newUser = await User.create({
    //   name:"yongkps",
    //   email:"yong@etsme.com",
    //   password:"yongkps",
    //   phone:"12312341234"
    // });

    // User.findAll().then((data) =>{
    //   console.log("user table",data)
    // })
}

const User = kpssql.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
      },
  })

CreateUserTable()

async function createUser(userIns) {

    try {
        const tmpUser = User.findOne(User.name)
        if (tmpUser){
            throw new Error("用户已经存在")
        }
        const user = await User.create(userIns);
        console.log('User created:', user.toJSON());
        return user
    } catch (error) {
      console.error('Error creating user:', error);
      return {}
    }
  }


async function verifyUser(userInfo){
  return new Promise( async (resolve) => {
    if (!userInfo.name){
      resolve(false)
    }
    try {
      query={
        where: {
          name: userInfo.name
        }
      }
        const tmpUser = await  User.findOne(query)
        console.log("tmpUser",tmpUser)
        if (!tmpUser){
          resolve(false)
        }
        if (tmpUser.password === userInfo.password){
            resolve(true)
        }else{
          resolve(false)
        }
    } catch (error) {
      console.error('Error query user:', error);
      resolve(false)
    }
  })
}

module.exports = {
    User,
    verifyUser,
}