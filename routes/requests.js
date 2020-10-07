//LIBRARIES
const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var session = require('express-session');
const flash = require('connect-flash');

//SCHEMA
const Bird = require('../models/bird');
const AddRequest = require('../models/addRequest');
const UpdateRequest = require('../models/updateRequest');
const GalleryUpdateRequest = require('../models/galleryUpdateRequest');

//ROUTES
app.get('/newBirdList', (req, res) => {
  AddRequest.find({}, (err, requests) => {

    if (err || !requests) {
      console.log(err)
      req.flash('error', "Unable to access requests")
      res.redirect('back')

    } else {
      res.render('../Views/requests', {requests, birdInfo: false, action: 'new'})
    }
  })
})

app.get('/newBirdShow/:id', (req, res) => {
  AddRequest.findById(req.params.id, (err, request) => {

    if (err || !request) {
      console.log(err)
      req.flash('error', "Unable to access request")
      res.redirect('back')
    } else {
      res.render('../Views/showRequest', {birdInfo: true, bird: request, action: 'new'})
    }
  })
})

app.get('/acceptNew/:id', (req, res) => {
  (async() => {
    const request = await AddRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      console.log('error');
      req.flash('error', "Unable to access request")
      return res.redirect('back');
    }

    const bird = await Bird.create({name: request.name, img: request.img, description: request.description, appearance: request.appearance, diet: request.diet, habitat: request.habitat, range: request.range, gallery: request.gallery, size: request.size, colors: request.colors});

    if (!bird) {
      console.log('error')
      req.flash('error', "Unable to access request")
      return res.redirect('back')
    }

    await bird.save()
    req.flash('success', "New bird accepted! All users can now see this bird")
    res.redirect('/')

  })().catch(err => {
    req.flash('error', "Unable to access bird")
    res.redirect('/')
  })
})

app.get('/rejectNew/:id', (req, res) => {
  AddRequest.findByIdAndDelete(req.params.id, (err, request) => {
    if (err || !request) {
      req.flash('error', "Unable to access request")
      res.redirect('back')

    } else {
      req.flash('success', "New bird rejected!")
      res.redirect('/')
    }
  })
})

app.get('/updateBirdList', (req, res) => {
  UpdateRequest.find({}).populate('bird').exec((err, requests) => {

    if (err || !requests) {
      console.log(err)
      req.flash('error', "Unable to access requests")
      res.redirect('back')

    } else {
      res.render('../Views/requests', {requests, birdInfo: false, action: 'update'})
    }
  })
})

app.get('/updateBirdShow/:id', (req, res) => {
  UpdateRequest.findById(req.params.id).populate('bird').exec((err, request) => {

    if (err || !request) {
      console.log(err)
      req.flash('error', "Unable to access request")
      res.redirect('back')

    } else {
      res.render('../Views/showRequest', {birdInfo: true, bird: request, action: 'update'})
    }
  })
})

app.get('/acceptUpdate/:id', (req, res) => {
  (async() => {
    let overlap = []
    const currentReq = await UpdateRequest.findByIdAndDelete(req.params.id).populate('bird');

    let tempBirdData = { //Object stores the bird's info, before it was updated
      description: currentReq.bird.description,
      appearance: currentReq.bird.appearance,
      diet: currentReq.bird.diet,
      habitat: currentReq.bird.habitat,
      range: currentReq.bird.range,
      size: currentReq.bird.size,
      colors: currentReq.bird.colors,
    }

    const bird = await Bird.findByIdAndUpdate(currentReq.bird._id, {description: currentReq.description, appearance: currentReq.appearance, diet: currentReq.diet, habitat: currentReq.habitat, range: currentReq.range, size: currentReq.size, colors: currentReq.colors});

    if (!bird) {
      req.flash('error', "Unable to apply updates to bird");
      return res.redirect('back');
    }

    console.log(bird)

    const requests = await UpdateRequest.find({}).populate('bird');

    for (let request of requests) {
      if (request.bird.name == currentReq.bird.name) {
        overlap.push(request)
      }
    }

    for (let request of overlap) {
      for (let attr of ['description', 'appearance', 'diet', 'habitat', 'range', 'size', 'colors']) {

        if (tempBirdData[attr].toString() == request[attr].toString()) {
          request[attr] = currentReq[attr];
        }
      }

      request.save()
    }

    req.flash('success', "Bird updated! These changes can now be seen by all users")
    res.redirect('/')

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database");
    res.redirect('back')
  })
})

app.get('/rejectUpdate/:id', (req, res) => {
  UpdateRequest.findByIdAndDelete(req.params.id, (err, request) => {
    if (err || !request) {
      req.flash('error', "Unable to delete update")
      res.redirect('back')

    } else {
      req.flash('success', "Update rejected!")
      res.redirect('/')
    }
  })
})

app.get('/galleryUpdateList', (req, res) => {
  GalleryUpdateRequest.find({}).populate('bird').exec((err, requests) => {

    if (err || !requests) {
      console.log(err)
      req.flash('error', "Unable to access requests")
      res.redirect('back')

    } else {
      res.render('../Views/requests', {requests, birdInfo: false, action: 'galleryUpdate'})
    }
  })
})

app.get('/galleryUpdateShow/:id', (req, res) => {
  GalleryUpdateRequest.findById(req.params.id).populate('bird').exec((err, request) => {

    if (err || !request) {
      console.log(err)
      req.flash('error', "Unable to access request")
      res.redirect('back')

    } else {
      res.render('../Views/showGalleryRequest', {birdInfo: false, bird: request})
    }
  })
})

app.get('/acceptGalleryUpdate/:id', (req, res) => {
  (async() => {
    const request = await GalleryUpdateRequest.findByIdAndDelete(req.params.id).populate('bird');

    if (!request) {
      req.flash('error', "Error accessing request")
      return res.redirect('back');
    }

    if (request.action == "add") {
      request.bird.gallery.push([request.img[0], request.img[1]])
      request.bird.save()
      req.flash('success', "Image added to bird gallery!")

    } else if (request.action == "delete") {
      request.bird.gallery.splice(request.imgIndex, 1)
      request.bird.save()
      req.flash('success', "Image deleted from bird gallery!")
    }

    res.redirect('/')

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database")
    res.redirect('back')
  })
})

app.get('/rejectGalleryUpdate/:id', (req, res) => {
  GalleryUpdateRequest.findByIdAndDelete(req.params.id, (err, request) => {
    if (err || !request) {
      req.flash('error', "Unable to delete gallery update")
      res.redirect('back')

    } else {
      req.flash('success', "Gallery Update rejected!")
      res.redirect('/')
    }
  })
})
module.exports = app;
