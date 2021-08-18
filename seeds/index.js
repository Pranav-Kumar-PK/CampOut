const mongoose = require('mongoose');
const Campground = require("../models/campground");
const Reviews = require("../models/reviews");
const Users = require("../models/user");
const cities = require("./cities");
const cities2 = require("./cities2");
const seedsHelper = require("./seedsHelper");

mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((d) => {
        console.log("Mongoose Connected");
    })
    .catch((err) => {
        console.log("ERROR OCCURED");
        console.log(err);
    })

const seedDB = async() => {
    await Campground.deleteMany({});
    //await Reviews.deleteMany({});
    //await Users.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 400);
        const randPrice = random1000 + 100;
        const random17 = Math.floor(Math.random() * 17);
        const random20 = Math.floor(Math.random() * 20);
        const camp = new Campground({
            author: '6114256fb6b0970442d9c4f7',
            location: `${cities2[i].city}, ${cities2[i].admin_name}`,
            title: `${seedsHelper.descriptors[random17]} ${seedsHelper.places[random20]}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel provident consectetur unde, veritatis illum maiores ad in aspernatur non natus impedit optio nobis laborum expedita excepturi doloribus autem. Doloremque, rerum.",
            price: randPrice,
            geometry: {
                type: 'Point',
                coordinates: [
                    parseInt(cities2[i].lng),
                    parseInt(cities2[i].lat)
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876161/YelpCamp/uqrd4xec0bjcpclbgv0u.jpg',
                    filename: 'YelpCamp/uqrd4xec0bjcpclbgv0u'
                },
                {
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876164/YelpCamp/oqyzbzepr9rivuihf0zj.jpg',
                    filename: 'YelpCamp/oqyzbzepr9rivuihf0zj'
                },
                {
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876186/YelpCamp/fwyiklxyuwwzpcstwa88.jpg',
                    filename: 'YelpCamp/fwyiklxyuwwzpcstwa88'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})