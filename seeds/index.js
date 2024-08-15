const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) =>
    array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {

    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6656d83a5d14dc97b268cc49',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima doloremque, architecto aperiam fuga dignissimos deserunt mollitia nam omnis ea, excepturi atque suscipit reprehenderit quibusdam molestiae eius dicta quia magnam temporibus.',
            price,
            geometry:
            {
                type: 'Point',
                coordinates:
                    [
                        cities[random1000].longitude,
                        cities[random1000].latitude
                    ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ds8suhohw/image/upload/v1718609517/YelpCamp/zm7wxdq5zok5yzvqygy6.jpg',
                    filename: 'YelpCamp/zm7wxdq5zok5yzvqygy6',

                },
                {
                    url: 'https://res.cloudinary.com/ds8suhohw/image/upload/v1718609519/YelpCamp/zq8kuyt0faltkpup7dzv.jpg',
                    filename: 'YelpCamp/zq8kuyt0faltkpup7dzv',

                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
