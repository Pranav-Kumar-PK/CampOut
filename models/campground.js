const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/campgrounds/${this._id}"> ${this.title} </a>`
});

CampgroundSchema.plugin(mongoosePaginate);

CampgroundSchema.post('findOneAndDelete', async(doc) => {
    if (doc) {
        // await Review.remove({
        //     _id: {
        //         $in: doc.reviews
        //     }
        // })
        for (id of doc.reviews) {
            await Review.findByIdAndDelete(id);
        }
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;