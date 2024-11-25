const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async(req,res)=>{
    const { country } = req.query;
    const allListings = await Listing.find({});
    let countryListing = country
      ? allListings.filter(
          (listing) => listing.country.toLowerCase() === country.toLowerCase()
        )
      : allListings;
    // console.log(countryListing);
    if (countryListing.length == 0) {
      req.flash("error", "not available");
      res.redirect("/listings");
    }
  
    res.render("listings/index.ejs", { allListings: countryListing });
    
  };

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path  : "reviews" , populate :{ path : "author",},}).populate("owner");
    if(!listing){
        req.flash("error" , "Listing You Requsted Does Not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show",{listing});
};

module.exports.createListing = async (req, res,next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
    

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename , url};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();

    console.log(savedListing);

    req.flash("success" , "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing You Requsted Does Not Exist");
        res.redirect("/listings");
    }

    let originalimageUrl = listing.image.url;
    originalimageUrl = originalimageUrl.replace("/upload" , "/upload/h_100,w_100");
    res.render("listings/edit.ejs", { listing , originalimageUrl });
};

module.exports.updateListing=async (req,res)=>{
    let response = await geocodingClient
   .forwardGeocode({
     query: req.body.listing.location,
     limit: 1,
   })
   .send();
 console.log(response.body.features[0].geometry);

 const { id } = req.params;
 let listing = await Listing.findByIdAndUpdate(
   id,
   { ...req.body.listing },
   { runValidators: true }
 );
 listing.geometry = response.body.features[0].geometry;
 await listing.save();
 if (typeof req.file !== "undefined") {
   let url = req.file.path;
   let filename = req.file.filename;
   let image = { url, filename };
   listing.image = image;
   await listing.save();
 }
     req.flash("success","Listing Updated");
     res.redirect(`/listings/${id}`);
};

/*module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename , url};
        await listing.save();
    }

    req.flash("success" , "Listing Updated");
    
};*/

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted");
    res.redirect("/listings");
}