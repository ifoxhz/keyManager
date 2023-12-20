
const { Sequelize,DataTypes} = require('sequelize')
const kpssql = new Sequelize('kpsdatabase', 'root', 'yongkps', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});


async function CreatePermitDeviceTable() {

    await PermitDevice.sync({}); // 使用 { force: true } 可以强制重新创建表
    console.log('Permit Device Tables created!');

    // const newUser = await User.create({
    //   name:"yongkps",
    //   email:"yong@etsme.com",
    //   password:"yongkps",
    //   phone:"12312341234"
    // });

    // Product.findAll().then((data) =>{
    //   console.log("product table",data)
    // })
}

const PermitDevice = kpssql.define('PermitDevice', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
    },
    permitname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permitid: {
      type: DataTypes.INTEGER,
      allowNull: false,
       /**
        * @INDEX
       */
    },
    permitdevicestatus:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    permitdevicedesc:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    createtime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    operatetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    productionline:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

CreatePermitDeviceTable()

function createPermitDevice(prodIns) {
  return new Promise(async (resolve, reject) => {
    try{
      const proc = await PermitDevice.create(prodIns);
      console.log('Permit created:', proc.toJSON());
      resolve(proc)
    } catch (error) {
      console.error('Failed to creating Permit with error: ', error);
      reject(error)
    }
  })
    
}

function deletePermitDevice(id) {
  return new Promise(async (resolve, reject) => {
    try{
      const proc = await Permit.destroy({
        where: { id }
      });
      console.log('Product delete:',proc);
      resolve(proc)
    } catch (error) {
      console.error('Error delete Product:', error);
      reject(error)
    }
  })
    
}


async function queryPermitDevice(options = {}){
  console.log(options)
  return new Promise( async (resolve,reject) => {
    try {
      // query={
      //   where: {
      //     id: procInfo.id
      //   }
      // }
      query ={
          limit: parseInt(options.pageSize),
          offset: parseInt(options.offset),
          where: {
            permitid: parseInt(options.id)
          }
      }
      console.log("QueryProduct query log",query)
      const count = await PermitDevice.count()
      const tmpproc = await  PermitDevice.findAll(query)
      resolve({count, list:tmpproc})
    } catch (error) {
      console.error('Error query user:', error);
      reject(error)
    }
  })
}




async function findPermitDevice(procInfo){
  console.log(userInfo)
  return new Promise( async (resolve) => {
    if (!procInfo.name){
      resolve(null)
    }
    try {
      query={
        where: {
          id: procInfo.id
        }
      }
        const tmpproc = await  Product.findOne(query)
        resolve(tmpproc)
    } catch (error) {
      console.error('Error query user:', error);
      resolve(null)
    }
  })
}


module.exports = {
  PermitDevice,
  findPermitDevice,
  createPermitDevice,
  queryPermitDevice,
  deletePermitDevice
}