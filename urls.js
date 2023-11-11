const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '11337799Ee__',
    database: 'new_db'
})
connection.connect()

function setUrls(app){
    connection.query("SELECT * FROM studentgroup;", (err, result) =>{
        app.get('/', (req, res) => {
            res.render('teachers/groupList', {
                'groups':  result,
            });
        });
    });
    app.get('/user/group/:id', (req, res) => {
        console.log(req.params.id)
        connection.query("SELECT * FROM user WHERE groupId=?;", [req.params.id], (err, result) =>{
                res.render('teachers/group', {
                    'students':  result,
                });

        });
    });


}

module.exports = {setUrls}