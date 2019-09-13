const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const expressSanitizer = require('express-sanitizer')
const methodOverride = require('method-override')
const app = express()
mongoose.connect('mongodb+srv://hemant123:hemant123@cluster0-wjckl.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.expressSanitizer())
app.use(methodOverride('_method'))


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

//edit route
app.get('/blogs/:id/edit', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.render('edit', { blog: foundBlog })
    }
  })
})

//update route
app.post('/blogs/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      res.redirect('/blogs')
    } else {
      blog.title = req.body.blog.title
      blog.image = req.body.blog.image
      blog.body = req.body.blog.body
      blog.save()
        .then(function (updated_blog) {
          res.redirect('/blogs')
        })
        .catch(function (err) {
          res.redirect('/blogs')
        })
    }
  })
})
//delete route
app.get('/blogs/:id/delete', function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err, blog) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/blogs')
    }
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, function () {
  console.log(`server is listening at port ${PORT}`)
})