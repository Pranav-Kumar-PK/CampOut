const Campground = require("../models/campground");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const FuzzySearch = require("fuzzy-search");

module.exports.index = async(req, res) => {
    const allCamps = await Campground.find({});
    if (!req.query.page) {
        req.query.page = 1;
    }
    let search = false;
    if (req.query.search) {
        req.query.page = 1;
        const searcher = new FuzzySearch(allCamps, ['title', 'location'], {
            caseSensitive: false,
            sort: true,
        });
        const loopCamps = searcher.search(`${req.query.search}`);
        search = true;
        res.render("campgrounds/index", { loopCamps, allCamps, search });
    } else {
        Campground.paginate({}, {
            page: req.query.page,
            limit: 10,
            sort: { title: 1 }
        }, function(err, camps) {
            // result.docs
            // result.total
            // result.limit - 10
            // result.page - 3
            // result.pages
            const loopCamps = camps.docs
            res.render("campgrounds/index", { loopCamps, camps, allCamps, search });
        });
    }

}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async(req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
}

module.exports.renderEditForm = async(req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
}

module.exports.updateCampground = async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete = async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}