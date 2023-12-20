
const { Sequelize,DataTypes} = require('sequelize')
const kpssql = new Sequelize('kpsdatabase', 'root', 'yongkps', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});


async function CreateProductTable() {

    await Product.sync({}); // 使用 { force: true } 可以强制重新创建表
    console.log('Product Tables created!');

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

const Product = kpssql.define('Product', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
    },
    productname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productmodel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chipmodel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    devicetotal: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    devicebalance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isencryp:{
      type: DataTypes.STRING(8),
      defaultValue:"no"
    },
    productkey:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createtime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  })

CreateProductTable()

function createProduct(prodIns) {
  return new Promise(async (resolve, reject) => {
    try{
      const proc = await Product.create(prodIns);
      console.log('Product created:', proc.toJSON());
      resolve(proc)
    } catch (error) {
      console.error('Failed to creating Product with error: ', error);
      reject(error)
    }
  })
    
}

function deleteProduct(id) {
  return new Promise(async (resolve, reject) => {
    try{
      const proc = await Product.destroy({
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


async function queryProduct(options = {}){
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
          offset: parseInt(options.offset)
      }
      console.log("QueryProduct query log",query)
      const count = await Product.count()
      const tmpproc = await  Product.findAll(query)
      resolve({count, list:tmpproc})
    } catch (error) {
      console.error('Error query user:', error);
      reject(error)
    }
  })
}


async function findProduct(procInfo){
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


async function ProductNameList(){
  console.log("ProductNameList")
  return new Promise( async (resolve) => {
    try {
      query={
          attributes: ['productname'], // 只选择需要的字段
          group: ['productname'] // 按指定字段分组
      }
        const tmpproc = await  Product.findAll(query)
        console.log("ProductNameList",tmpproc)
        resolve(tmpproc)
    } catch (error) {
      console.error('Error query user:', error);
      reject(error)
    }
  })
}



module.exports = {
  Product,
  findProduct,
  createProduct,
  queryProduct,
  deleteProduct,
  ProductNameList
}