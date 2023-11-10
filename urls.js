function setUrls(app){

    app.get('/', (req, res) => {
        res.render('index', {
            message: "Главная!!!!!страница"
        });
    });

    app.get('/user/:username/:id', (req, res) => {
        res.send('This is page' + req.params.id)
    })

}

module.exports = {setUrls}