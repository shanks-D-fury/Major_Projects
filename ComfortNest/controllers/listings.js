const hotelInfo = require("../models/hotelListing.js");
const Map_coordinates = require("../utils/mapCoOridinates.js");

module.exports.indexListing = async (req, res) => {
	const featchedInfo = await hotelInfo.find();
	res.render("listings/index.ejs", { featchedInfo });
};

module.exports.newFormRender = (req, res) => {
	res.render("listings/new.ejs");
};

module.exports.showRender = async (req, res) => {
	let { id } = req.params;
	const listing = await hotelInfo
		.findById(id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("owner");
	if (!listing) {
		req.flash("error", "Listing you requested Does Not exist!");
		return res.redirect("/listings");
	}
	res.render("listings/show.ejs", { listing });
};

module.exports.newListing = async (req, res) => {
	let { location, country } = req.body.Listing;
	const geometry = await Map_coordinates(location, country);
	const newHotelInfo = new hotelInfo(req.body.Listing);
	newHotelInfo.owner = req.user._id;
	if (typeof req.file != "undefined") {
		newHotelInfo.image.url = req.file.path;
		newHotelInfo.image.filename = req.file.filename;
	}
	newHotelInfo.geometry = geometry;
	let listing = await newHotelInfo.save();
	console.log(listing);
	req.flash("success", "New Listing Succesfully Created");
	res.redirect("/listings");
};

module.exports.editFormRender = async (req, res) => {
	let { id } = req.params;
	const Listing = await hotelInfo.findById(id);
	if (!Listing) {
		req.flash("error", "Listing you requested Does Not exist!");
		return res.redirect("/listings");
	}
	res.render("listings/edit.ejs", { Listing });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let listing = await hotelInfo.findByIdAndUpdate(id, { ...req.body.Listing });
	if (typeof req.file != "undefined") {
		listing.image.url = req.file.path;
		listing.image.filename = req.file.filename;
	}
	await listing.save();
	req.flash("success", "Listing Editied Succesfully");
	res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
	let { id } = req.params;
	await hotelInfo.findByIdAndDelete(id);
	req.flash("success", "Listing Deleted Succesfully");
	res.redirect(`/listings`);
};
