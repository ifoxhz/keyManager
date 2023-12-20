const express = require('express');
const session = require('express-session'); 
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const {User, verifyUser} = require("./user")
const {Product, createProduct, queryProduct, deleteProduct} = require("./product")
const {Permit, createPermit, queryPermit, deletePermit,PermitNameList} = require("./permit")
const {PermitDevice, createPermitDevice, queryPermitDevice, deletePermitDevice} = require("./permitdevice")



app.use(session({ 
  secret: 'KPS-secret-backend', 
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    maxAge: 60 * 60 * 1000, // 设置会话超时时间为 60 分钟（以毫秒为单位）
  }
}))
// 使用 body-parser 中间件解析 POST 请求的请求体
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


// GET 请求示例
app.get('/api/data', (req, res) => {
  // 在这里编写处理 GET 请求的逻辑
  // 例如从数据库查询数据或执行其他操作

  // 假设返回一个包含数据的数组
  const data = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' }
  ];

  res.json(data); // 将数据以 JSON 格式发送回客户端
});

// POST 请求示例
app.post('/server/login', (req, res) => {
  // 在这里编写处理 POST 请求的逻辑
  // 例如将数据保存到数据库或执行其他操作

  // 假设接收到的数据位于请求体的 name 字段中
  
  if (req.session.userId){
    console.log("用户已经登录",req.session.userId,"\n\r")
    result = {UserValid:true,Session:req.session.userId}
    res.json(result);
    return 
  }else{
    console.log("用户开始登录，session为空")
  }
  
  const tmpUser = new User()
  tmpUser.name = req.body.name
  tmpUser.password = req.body.password
  
  verifyUser(tmpUser).then((ret) =>{
    if(ret){
      req.session.userId = tmpUser.name ; 
    }
    result = {UserValid:ret,Session:req.session.userId}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  })

});

app.get('/server/product/get', (req, res) => {
  // 在这里编写处理 POST 请求的逻辑
  // 例如将数据保存到数据库或执行其他操作

  if (!req.session.userId){
    res.status = 401
    res.json("未登录")
    return
  }else{
    console.log("product/get session",req.session.userId)
  }

  console.log(req.query)
  let options = {}
  options.pageSize = req.query.pageSize
  options.offset = req.query.offset

  
  queryProduct(options).then((ret) =>{
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  }).catch ((err) => {
    console.log("QueryProduct",err)
    res.status = 400
    res.json("service error")
  })

});

  app.post('/server/product/create', (req, res) => {

    if (!req.session.userId){
      res.status = 401
      res.json("未登录")
      return
    }else{
      console.log("product/create",req.session.userId)
      console.log("product/create", req.body)
    }
    // 在这里编写处理 POST 请求的逻辑
    // 例如将数据保存到数据库或执行其他操作
  
    // let tmpProduct =  Product.build({
    //   productname: req.body.productname,
    //   productmodel: req.body.productmodel,
    //   chipmodel:req.body.chipmodel,
    //   devicetotal: req.body.devicetotal,
    //   devicebalance:req.body.devicebalance
    // })
   

    // console.log("input product", tmpProduct)
    
    createProduct({
      productname: req.body.productname,
      productmodel: req.body.productmodel,
      chipmodel:req.body.chipmodel,
      productkey:req.body.productkey
    })
    .then((ret) =>{
      console.log("succeed to create product",ret)
      result = {Product:ret}
      res.json(result); // 将结果以 JSON 格式发送回客户端
    })
    .catch((err) =>{
      console.log("Failed to create product with error", err)
      res.status = 400
      if (err.name === 'SequelizeValidationError') {
        console.error('验证错误：', err.errors);
        res.json("Parameter error")
      } else {
        console.error('其他错误：', err);
        res.json("unknowed error")
      }
    })
  });

    app.post('/server/product/delete', (req, res) => {

      if (!req.session.userId){
        res.status = 401
        res.json("未登录")
        return
      }else{
        console.log("product/delete session",req.session.userId)
      }
      // 在这里编写处理 POST 请求的逻辑
      // 例如将数据保存到数据库或执行其他操作
    
      // let tmpProduct =  Product.build({
      //   productname: req.body.productname,
      //   productmodel: req.body.productmodel,
      //   chipmodel:req.body.chipmodel,
      //   devicetotal: req.body.devicetotal,
      //   devicebalance:req.body.devicebalance
      // })
     
  
      // console.log("input product", tmpProduct)
      
      deleteProduct(req.body.id)
      .then((ret) =>{
        console.log("succeed to delete product",ret)
        result = {Product:ret}
        res.json(result); // 将结果以 JSON 格式发送回客户端
      })
      .catch((err) =>{
        console.log("Failed to delete product with error", err)
        res.status = 400
        if (err.name === 'SequelizeValidationError') {
          console.error('验证错误：', err.errors);
          res.json("Parameter error")
        } else {
          console.error('其他错误：', err);
          res.json("unknowed error")
        }
      })
  
});

//permit 操作

app.get('/server/permit/get', (req, res) => {
  // 在这里编写处理 POST 请求的逻辑
  // 例如将数据保存到数据库或执行其他操作

  if (!req.session.userId){
    res.status = 401
    res.json("未登录")
    return
  }else{
    console.log("product/get session",req.session.userId)
  }

  console.log(req.query)
  let options = {}
  options.pageSize = req.query.pageSize
  options.offset = req.query.offset
  options.id = req.query.permitProdId

  
  queryPermit(options).then((ret) =>{
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  }).catch ((err) => {
    console.log("queryPermit",err)
    res.status = 400
    res.json("service error")
  })

});

app.post('/server/permit/create', (req, res) => {

  if (!req.session.userId){
    res.status = 401
    res.json("未登录")
    return
  }else{
    console.log("permit/create",req.session.userId)
    console.log("permit/create", req.body)
  }
  
  createPermit({
    permitname: req.body.permitname,
    permitlabel: req.body.permitlabel,
    permittotal:req.body.permittotal,
    permitbalance:req.body.permittotal,
    permitProdId:req.body.permitProdId
  })
  .then((ret) =>{
    console.log("succeed to create permit",ret)
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  })
  .catch((err) =>{
    console.log("Failed to create permit with error", err)
    res.status = 400
    if (err.name === 'SequelizeValidationError') {
      console.error('验证错误：', err.errors);
      res.json("Parameter error")
    } else {
      console.error('其他错误：', err);
      res.json("unknowed error")
    }
  })
});

  app.post('/server/permit/delete', (req, res) => {

    if (!req.session.userId){
      res.status = 401
      res.json("未登录")
      return
    }else{
      console.log("product/delete session",req.session.userId)
    }
    // 在这里编写处理 POST 请求的逻辑
    // 例如将数据保存到数据库或执行其他操作
  
    // let tmpProduct =  Product.build({
    //   productname: req.body.productname,
    //   productmodel: req.body.productmodel,
    //   chipmodel:req.body.chipmodel,
    //   devicetotal: req.body.devicetotal,
    //   devicebalance:req.body.devicebalance
    // })
   

    // console.log("input product", tmpProduct)
    
    deletePermit(req.body.id)
    .then((ret) =>{
      console.log("succeed to delete product",ret)
      result = {Product:ret}
      res.json(result); // 将结果以 JSON 格式发送回客户端
    })
    .catch((err) =>{
      console.log("Failed to delete product with error", err)
      res.status = 400
      if (err.name === 'SequelizeValidationError') {
        console.error('验证错误：', err.errors);
        res.json("Parameter error")
      } else {
        console.error('其他错误：', err);
        res.json("unknowed error")
      }
    })

});

// permitDevice 服务

app.get('/server/permitdevice/get', (req, res) => {
  // 在这里编写处理 POST 请求的逻辑
  // 例如将数据保存到数据库或执行其他操作

  if (!req.session.userId){
    res.status = 401
    res.json("未登录")
    return
  }else{
    console.log("permitdevice/get session",req.session.userId)
  }

  console.log(req.query)
  let options = {}
  options.pageSize = req.query.pageSize
  options.offset = req.query.offset
  options.id = req.query.permitid

  
  queryPermitDevice(options).then((ret) =>{
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  }).catch ((err) => {
    console.log("queryPermit",err)
    res.status = 400
    res.json("service error")
  })

});

app.post('/server/permitdevice/create', (req, res) => {

  if (!req.session.userId){
    res.status = 401
    res.json("未登录")
    return
  }else{
    console.log("permit/create",req.session.userId)
    console.log("permit/create", req.body)
  }
  
  createPermitDevice({
    permitname: req.body.permitname,
    permitid: req.body.permitid,
    productionline:req.body.productionline,
  })
  .then((ret) =>{
    console.log("succeed to create permit",ret)
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  })
  .catch((err) =>{
    console.log("Failed to create permit with error", err)
    res.status = 400
    if (err.name === 'SequelizeValidationError') {
      console.error('验证错误：', err.errors);
      res.json("Parameter error")
    } else {
      console.error('其他错误：', err);
      res.json("unknowed error")
    }
  })
});

  app.post('/server/permitdevice/delete', (req, res) => {

    if (!req.session.userId){
      res.status = 401
      res.json("未登录")
      return
    }else{
      console.log("permitdevice/delete session",req.session.userId)
    }

    
    deletePermitDevice(req.body.id)
    .then((ret) =>{
      console.log("succeed to delete product",ret)
      result = {Product:ret}
      res.json(result); // 将结果以 JSON 格式发送回客户端
    })
    .catch((err) =>{
      console.log("Failed to delete product with error", err)
      res.status = 400
      if (err.name === 'SequelizeValidationError') {
        console.error('验证错误：', err.errors);
        res.json("Parameter error")
      } else {
        console.error('其他错误：', err);
        res.json("unknowed error")
      }
    })

});

//读取产品分类接口
app.get('/server/permit/namelist', (req, res) => {
  // 在这里编写处理 POST 请求的逻辑
  // 例如将数据保存到数据库或执行其他操作

  // if (!req.session.userId){
  //   res.status = 401
  //   res.json("未登录")
  //   return
  // }else{
  //   console.log("permitdevice/get session",req.session.userId)
  // }


  console.log("permit namelist")
  PermitNameList().then((ret) =>{
    result = {Data:ret}
    res.json(result); // 将结果以 JSON 格式发送回客户端
  }).catch ((err) => {
    console.log("queryPermit",err)
    res.status = 400
    res.json("service error")
  })

});



// 启动服务器
const port = 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});