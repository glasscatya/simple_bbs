var express = require('express');
const res = require('express/lib/response');
const conn = require('../public/javascripts/conn');
const session = require('express-session');
const { render, send } = require('express/lib/response');
var router = express.Router();

router.use(session({
  secret:'Keyboard cat',
  resave:false,
  saveUninitialized:true,
  cookie:('name','value',{
    maxAge:5*60*1000,
    secure:false
  })
}));

/* conn.query(sql, (err, data) => {
  if(err) throw err;
  
}) */
// 
// 登录界面
// 
router.get('/', function(req, res, next) {
  res.render('login');
  return;
});
// 
// 注册界面
// 
router.get('/zhuce', (req, res) => {
  res.render('zhuce');
  return;
})
// 
// 论坛主页
// 
router.get('/index', (req, res) => {
  // 未登录获取session 无法访问主页 跳转至登陆界面
    if(req.session.userinfo){
      let sql = 'select * from content';
      conn.query(sql,(err,data) => {
        if(err) throw err;
        // console.log(data);
            res.render('index', {
            content:data,
            session:req.session.userinfo
          });
    });
  } else {
    res.redirect('/');
  }
});
// 
// 登陆验证
// 
router.post('/btnlogin', (req, res) => {
  // req.body 传回来的数据 是string  
  let user = req.body.username;
  let pwd = req.body.password;
  let sql = 'select * from user';

  conn.query(sql, (err, data) => {
    let users = data;
    let u =0;
    while(u < users.length) {
      if(users[u].username == user && users[u].password == pwd) {
        req.session.userinfo = user;
        res.send({
          message:'成功',
          code:0
        });
        /* res.redirect('/ok'); */
        return;
      } else if(u === users.length - 1) {
        res.send({
          message:'错误',
          code:1
        });
        return;
      }
      u++;
    }
  });
  return;
});
// 
// 注册的服务器端
// 
router.post('/btnzhuce', (req, res) => {
  console.log(req.body.username);
  let user = req.body.username;
  let psw = req.body.password;
  let sql = `INSERT INTO user (username,password) VALUE ('${user}','${psw}')`;

  conn.query(sql, (err, data) => {
    if(err) throw err;
    res.send({
      message:true
    });
  })
})
// 
// 访问帖子的服务端
// 
router.get('/contont', (req, res) => {
  let id = req.query.id;
  res.locals.id = id;
  // console.log(req.session.userinfo);
  let sql = `select * from content c LEFT OUTER JOIN text t on c.con_id=t.con_id where c.con_id='${id}'`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    console.log(data);
    res.render('contont', {
      contont:data,
      session:req.session.userinfo
    });
    return;
  })
})
// 
// 发帖的服务端
// 
router.get('/fatie', (req, res) => {
  let user = req.session.userinfo;
  res.render('fatie',{user:user});
});
// 
// 提交帖子的处理
// 
router.post('/btnpost', (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  let user = req.session.userinfo;
  let con_id = Math.round(Math.random()*100000+10);

  let sql = `INSERT INTO content (con_id,title,con_name,content) value ('${con_id}','${title}','${user}','${content}')`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    console.log(data);

    res.send({
      message:'成功',
      code:0
    });
    return;
  })
})
// 
// 修改评论的后端
// 
router.post('/editText', (req, res) => {
  console.log(req.body);
  let newText = req.body.pinglun;
  let con_id = req.body.con_id;
  let real_id = req.body.real_id;
  let id = req.session.userinfo;
  let sql = `UPDATE text  SET text='${newText}' where read_id=${real_id}`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    console.log(data);
    res.redirect(`/contont?id=${con_id}`);
  }); 
});
// 
// 删除评论的后端
// 
router.post('/btndel', (req, res) => {
  console.log(req.body);
  let read_id = req.body.real_id;
  let sql = `DELETE FROM text WHERE read_id=${read_id}`;

  conn.query(sql,(err, data) => {
    if(err) throw err;
    console.log(data);
    res.send({
      message:'成功'
    });
    return;
  });
})
//
// 编辑帖子的后端
// 
router.post('/con_edit', (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  let id = req.body.id;

  let sql = `UPDATE content SET title='${title}',content='${content}' where id = ${id}`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    res.send({
      message:'成功'
    });
    return;
  })
})
// 
// 删除帖子的后端
// 
router.post('/con_del', (req,res) => {
  let id = req.body.id;
  let sql = `DELETE FROM content WHERE id=${id}`;

  conn.query(sql,(err, data) => {
    if(err) throw err;
    res.send({
      message:'成功'
    });
    return;
  });
})
// 
// 评论的后端
// 
router.post('/pspinglun', (req, res) => {
  let session = req.body.session;
  let txt = req.body.txt;
  let con_id = req.body.con_id;
  
  let sql = `INSERT INTO text (con_id,name,text) VALUES ('${con_id}','${session}','${txt}')`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    res.send({
      message:'成功'
    });
    return;
  })
})
module.exports = router;
