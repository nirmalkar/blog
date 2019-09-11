const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
mongoose.connect('mongodb+srv://hemant123:hemant123@cluster0-wjckl.gcp.mongodb.net/test?retryWrites=true&w=majority')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
})
const Blog = mongoose.model('Blog', blogSchema)



// RESTFUL ROUTES
//landing page
app.get('/', function (req, res) {
  res.redirect('/blogs')
})

app.get('/blogs', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err)
    } else {
      res.render('index', { blogs: blogs })
    }
  })
})

//new route
app.get('/blogs/new', function (req, res) {
  res.render('new')
})

//create route
app.post('/blogs', function (req, res) {
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render('new')
    } else {
      res.redirect('/blogs')
    }
  })
})

//show route

app.get('/blogs/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.render('show', { blog: foundBlog })
    }
  })
})



const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`server is listening at port ${PORT}`)
})