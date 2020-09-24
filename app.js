//Libraries
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const http = require('http').createServer(app);

//Schema
const Bird = require('./models/bird');

//Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dbUser:dbUserPassword@cluster0.h3f4r.mongodb.net/FindYourBird?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!')
})

//Set up libraries
app.use(express.static(__dirname + "/public")); //Sets all styles/js/media to /public
app.set('views', __dirname + '/Views'); //Sets all html(EJS) files to Views
app.set('view engine', "ejs") //Sets view engine to EJS
app.use(bodyParser.urlencoded({extended: false})) //Allows us to read info from EJS pages
app.use(methodOverride('_method')); //Allows us to use PUT and DELETE


//ROUTES
app.get('/', (req, res) => { //Render index page
  res.render('index', {birdInfo: false, search: null});
})

app.post('/search', (req, res) => { //Route to search for a bird

  Bird.findOne({lowerName: req.body.name.toLowerCase()}, (err, foundBird) => {
    if (err) {
      res.redirect('/');

    } else if (!foundBird) {
      res.render('index', {birdInfo: false, search: req.body.name});

    } else {
      res.redirect(`/${foundBird._id}`);
    }
  })
})

app.get('/new', (req, res) => { //Route to access 'new bird' page
  res.render('new', {birdInfo: false, colors:['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'], sizes: ['Hummingbird Size', 'Songbird Size', 'Large Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'] });
})

app.post('/', (req, res) => { //Create new bird

  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']; //Find out list of habitats based on what was checked
  let finalHabitats = [];
  for (let habitat of habitats) {
    if (req.body[habitat] == 'on') {
      finalHabitats.push(habitat);
    }
  }

  let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink']; //Find out list of colors based on what was checked
  let finalColors = [];
  for (let color of colors) {
    if (req.body[color] == 'on') {
      finalColors.push(color);
    }
  }

  Bird.create({name: req.body.name, lowerName: req.body.name.toLowerCase(), img: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(','), habitat: finalHabitats, range: req.body.range, gallery: [req.body.img], size: req.body.size, colors: finalColors}, (err, bird) => {
    bird.save();
    res.render('index', {birdInfo: true, bird});
  })
})

app.get('/edit/:id', (req, res) => { //Edit bird info
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);
    } else {
      res.render('edit', {birdInfo: false, bird: foundBird, colors:['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'], sizes: ['Hummingbird Size', 'Songbird Size', 'Large Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']});
    }
  })
})

app.put('/update/:id', (req, res) => { //Update bird info
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'];

  let finalHabitats = [];
  for (let habitat of habitats) {
    if (req.body[habitat] == 'on') {
      finalHabitats.push(habitat);
    }
  }

  let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink']; //Find out list of colors based on what was checked

  let finalColors = [];
  for (let color of colors) {
    if (req.body[color] == 'on') {
      finalColors.push(color);
    }
  }


  Bird.findByIdAndUpdate(req.params.id, {name: req.body.name, img: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(', '), habitat: finalHabitats, range: req.body.range, gallery: [req.body.img], size: req.body.size, colors: finalColors}, (err, bird) => {
    bird.save();
    res.redirect(`/${bird._id}`);
  })
})

app.get('/identify', (req, res) => { //Route to render bird identification page
  let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'];
  let habitats = ['Urban/Suburban Area', 'Grassland', 'Tundra', 'Forest', 'Mountain', 'Coastal Area', 'Desert', 'Swamp/Marsh', 'Freshwater Body'];
  let sizes = ['Hummingbird Size', 'Songbird Size', 'Large Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size'];
  res.render('identify', {birdInfo: false, colors, habitats, sizes});
})

app.post('/identify', (req, res) => { //Calculate birds which match identification
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'];

  Bird.find({size: req.body.size}, (err, foundBirds) => {
    let birdList = [];
    let final = [];

    for (let bird of foundBirds) {
      if (bird.habitat.includes(habitats[req.body.habitat])) {
        birdList.push(bird);
      }
    }

    for (let bird of birdList) {
      let include = true; //Whether to be included or not
      for (let color of req.body.color) {
        if (!bird.colors.includes(color)) {
          include = false;
          break;
        }
      }

      if (include) {
        final.push(bird);
      }
    }

    console.log(final);
    res.render('results', {birdInfo: false, birds: final});
  })
})

app.get('/gallery', (req, res) => {
  res.redirect('back')
})

app.get('/gallery/:id', (req, res) => { //Display gallery of a particular bird
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);

    } else {
      res.render('gallery', {birdInfo: true, bird: foundBird});
    }
  })
})

app.put('/gallery/:id', (req, res) => { //Adds photo to a gallery of a particular bird
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);

    } else if (foundBird.gallery.includes(req.body.newImg)) {
      console.log('Image already in gallery');
      res.redirect('back')

    } else {
      foundBird.gallery.push(req.body.newImg);
      foundBird.save();
      res.redirect(`/gallery/${foundBird._id}`);
    }
  })
})

app.delete('/gallery/:id', (req, res) => { //Removes photo from the gallery of a particular bird
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);

    } else {
      foundBird.gallery.splice(foundBird.gallery.indexOf(req.query.url, 1));
      foundBird.save();
      res.redirect(`/gallery/${foundBird._id}`);
    }
  })
})


app.get('/:id', (req, res) => { //Display bird based on ID
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);

    } else {
      res.render('index', {birdInfo: true, bird: foundBird});
    }
  })
})


//Runs server
let port = process.env.PORT || 3000;

http.listen(port,process.env.IP, () => {
	console.log(":: App listening on port " + port + " ::");
});
