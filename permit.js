
const { Sequelize,DataTypes} = require('sequelize')
const kpssql = new Sequelize('kpsdatabase', 'root', 'yongkps', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});


async function CreatePermitTable() {

    await Permit.sync({}); // 使用 { force: true } 可以强制重新创建表
    console.log('Permit Tables created!');

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

const Permit = kpssql.define('Permit', {
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
    permitlabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permitProdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
       /**
        * @INDEX
       */
    },
    permittotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permitbalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permitpullcount:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    permitusedcount:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    permiterrorcount:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    permitstatus:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    createtime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  })

CreatePermitTable()

function createPermit(prodIns) {
  return new Promise(async (resolve, reject) => {
    try{
      const proc = await Permit.create(prodIns);
      console.log('Permit created:', proc.toJSON());
      resolve(proc)
    } catch (error) {
      console.error('Failed to creating Permit with error: ', error);
      reject(error)
    }
  })
    
}

function deletePermit(id) {
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


async function queryPermit(options = {}){
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
            permitProdId: options.id
          }
      }
      console.log("QueryProduct query log",query)
      const count = await Permit.count()
      const tmpproc = await  Permit.findAll(query)
      resolve({count, list:tmpproc})
    } catch (error) {
      console.error('Error query user:', error);
      reject(error)
    }
  })
}

async function updatePermit(permitInfo){
  console.log(permitInfo)
  return new Promise( async (resolve,reject) => {
    if (!permitInfo.id){
        reject("parameter error")
    }
    let newValues = {
    }
    permitInfo.permitname ? newValues.permitname = permitInfo.permitname:null
    permitInfo.permitlabel ? newValues.permitlabel = permitInfo.permitlabel:null

    let query = {
      where:{id:permitInfo.id}
    }
    try {
      const tmpproc = await  Permit.update(newValues,query)
      resolve(tmpproc)
    } catch (error) {
      console.error('Error updatePermit permit:', error);
      reject(error)
    }
  })
}


async function findPermit(procInfo){
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


async function PermitNameList(){
  console.log("PermitNameList")
  return new Promise( async (resolve,reject) => {
    try {
      query={
          attributes: ['permitname'], // 只选择需要的字段
          group: ['permitname'] // 按指定字段分组
      }
        const tmpproc = await  Permit.findAll(query)
        console.log("PermitNameList",tmpproc)
        resolve(tmpproc)
    } catch (error) {
      console.error('Error query user:', error);
      reject(error)
    }
  })
}

module.exports = {
  Permit,
  findPermit,
  createPermit,
  queryPermit,
  deletePermit,
  updatePermit,
  PermitNameList
}