const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(this, 'connection error!'));
db.once('open', () => {
    console.log('Database connected!')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randIndexOfCity = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60def0021e425a428867de45',
            location: `${cities[randIndexOfCity].city}, ${cities[randIndexOfCity].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit sed hic, in quia ullam iure amet quidem totam recusandae cupiditate voluptatum! Nesciunt quis earum vel neque voluptate quaerat expedita maxime!',
            images: [
                {
                    url: 'https://res.cloudinary.com/pesolcloud/image/upload/v1625645170/YelpCamp/xm0uzmyei3dkejzxmrpn.jpg',
                    filename: 'YelpCamp/xm0uzmyei3dkejzxmrpn'
                },
                {
                    url: 'https://res.cloudinary.com/pesolcloud/image/upload/v1625645170/YelpCamp/iia5tod3e0j7buuxdfgx.jpg',
                    filename: 'YelpCamp/iia5tod3e0j7buuxdfgx'
                }
            ]
        });
        await camp.save();
    };
};

// seed ann close database
seedDB().then(() => {
    db.close();
});




