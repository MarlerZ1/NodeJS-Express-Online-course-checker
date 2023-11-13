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
        connection.query("SELECT * FROM user WHERE groupId=?;", [req.params.id], (err, result) =>{
                res.render('teachers/group', {
                    'students':  result,
                });

        });
    });

    app.get('/user/work/:id', (req, res) => {
        console.log(req.params.id)
        connection.query("SELECT * FROM work WHERE userId=?;", [req.params.id], async (err, workResult) =>{

            context = []
            for (let i= 0; i < workResult.length; i++) {
                await connection.promise().query("SELECT * FROM task WHERE taskID=?;", [workResult[i].taskId]).then(([rows, fields]) => {
                    console.log(rows)
                    console.log(fields)
                    context[i] = {
                            "Work": workResult[i],
                            "Task": rows[0]
                    }
                })
            }
            // console.log(JSON.stringify(context))
            res.render('teachers/workList', {'works': context});

        });
    });

}

module.exports = {setUrls}