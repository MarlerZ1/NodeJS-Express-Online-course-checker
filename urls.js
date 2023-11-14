const mysql = require('mysql2')
const {compile} = require("twig/lib/compile");

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

    app.get('/user/works/:id', (req, res) => {
        group = 0
        connection.query("SELECT * FROM work WHERE userId=?;", [req.params.id], async (err, workResult) =>{

            context = []
            for (let i= 0; i < workResult.length; i++) {
                await connection.promise().query("SELECT * FROM task WHERE taskID=?;", [workResult[i].taskId]).then(async ([rows, fields]) => {
                    await connection.promise().query("SELECT * FROM user WHERE userId=?;", [workResult[i].userId]).then(([groupRows, fields]) => {
                        group = groupRows[0].groupId
                        context[i] = {
                            "Work": workResult[i],
                            "Task": rows[0]
                        }
                    })
                })
            }
            // console.log(JSON.stringify(context))
            res.render('teachers/workList', {
                'works': context,
                'group': group
            });

        });
    });


    app.get('/user/works/work/:id', (req, res) => {
        connection.query("SELECT * FROM work WHERE workId=?;", [req.params.id], (err, works) =>{
            connection.query("SELECT * FROM task WHERE taskId=?;", [works[0].taskId], (err, tasks)=>{
                connection.query("SELECT * FROM feedback WHERE workId=?;", [works[0].workId], (err, feedbacks)=>{
                    let feedback
                    if (feedbacks.length > 0)
                        feedback = feedbacks[0];
                    else
                        feedback = NaN

                    res.render('teachers/workCheck', {
                        'work': works[0],
                        'task': tasks[0],
                        'feedback': feedback
                    });
                })
            })
        });
    });

    app.post('/check/:id', (req, res) => {
        connection.query("UPDATE work SET grade=? WHERE workId=?;", [req.body.grade, req.params.id], () => {
            connection.query("SELECT * FROM work WHERE workId=?", [req.params.id], (err, works)=> {
                connection.query("SELECT * FROM feedback WHERE workId=?", [req.params.id], async (err, feedback)=>{
                    group = 0
                    context = []
                    if (feedback.length === 0)
                        await connection.promise().query("INSERT INTO feedback (proposedSolution, mistakeDescription, workId) VALUES (?, ?, ?)", [req.body.proposedSolution, req.body.mistakeDescription, req.params.id])
                    else
                        await connection.promise().query("UPDATE feedback SET proposedSolution=?, mistakeDescription=? WHERE workId=?", [req.body.proposedSolution, req.body.mistakeDescription, req.params.id])


                    // connection.query("SELECT * FROM work WHERE userId=?;", [works[0].userId], async (err, workResult) =>{
                        // for (let i= 0; i < workResult.length; i++) {
                        //     await connection.promise().query("SELECT * FROM task WHERE taskID=?;", [workResult[i].taskId]).then(async ([rows, fields]) => {
                        //         await connection.promise().query("SELECT * FROM user WHERE userId=?;", [workResult[i].userId]).then(([groupRows, fields]) => {
                        //             group = groupRows[0].groupId
                        //             context[i] = {
                        //                 "Work": workResult[i],
                        //                 "Task": rows[0]
                        //             }
                        //         })
                        //     })
                        // }
                        console.log("I`M HERE")
                        res.redirect('/user/works/' + works[0].userId);
                    // });
                })
            })
        });
    });


    app.get('/filter', (req, res)=>{

    })

}

module.exports = {setUrls}