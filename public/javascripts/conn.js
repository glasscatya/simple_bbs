const connection = require("mysql");

let conn = connection.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test'
});

conn.connect((err) => {
    console.log(err);
});


/* let sql = `select * from content c LEFT OUTER JOIN text t on c.con_id=t.con_id where c.con_id='1'`;
  conn.query(sql, (err, data) => {
    if(err) throw err;
    console.log(data);
    res.render('contont', {
      contont:data,
      session:req.session.userinfo
    });
  }) */








/* function query(sql,callback){
    conn.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}; */
/* let sql = 'select * from content';
  conn.query(sql,(err,data) => {
    console.log({content:data});
    console.log(data.length);
  })


 */

/* let title = '夜晚的潜水艇';

let sql = `select * from content c join text t on c.con_id=t.con_id where c.title='${title}'`;

conn.query(sql, (err, data) => {
  if(err) throw err;
  console.log(data);
});
conn.end(); 
*/

module.exports = conn;