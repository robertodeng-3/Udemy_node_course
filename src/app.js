const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geoCode = require('./utils/geoCode')
const forecast = require('./utils/forcast')

const app = express()
const port = process.env.PORT || 3000

//Deine paths for Exress config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index',{
    title:'Weather App',
    name: 'Robert O Driscoll'
    })
}) 

app.get('/about', (req, res) => {
    res.render('about',{
    title:'About',
    name: 'Robert O Driscoll'
    })
}) 
app.get('/help', (req, res) => {
        res.render('help',{
        helpText: 'This is some helpful text.',
        title:'Help',
        name: 'Robert O Driscoll'
        })
}) 

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!!'
        })
    }
    geoCode(req.query.address, (error,{latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error, forcastData) => {
            if (error){
                return res.send({error})
            }
            res.send({
                forcast: forcastData,
                location,
                address: req.query.address

            })

        })
    })

})
app.get('/products' , (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide some search term!'
        })

    }
    console.log(req.query.search)
    res.send({
        products: []
    })


})
app.get('*' ,(req,res) => {
    res.render('404', {
        title: '404',
        name: 'Robert O Driscoll',
        errorMessage: 'Page not found'
    })

})

app.listen(port, () => {
    console.log('server is up on port' + port)
})