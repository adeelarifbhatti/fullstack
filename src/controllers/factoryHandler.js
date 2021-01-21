const tryCatch = require('./../lib/tryCatch');
const catchError = require('./../lib/appErrors');
const APIFeatures = require('./../lib/queryString');

exports.deleteOne = Model => tryCatch(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new catchError('no Document was found', 404));
    }
    res.status(204).json({
    status: 'success',
    data: {
        data: null
    }
    });
});
exports.getAll = Model => tryCatch(async (req,res,next) => {
    const features = new APIFeatures(Model.find(), req.query)
    .editing().sorting().fields().paginate();
    const doc = await features.query;
    // To examine the Query we use .explain() and analyse the executionstatistic
    // And then create indexes
    //const doc = await features.query.explain();  
    console.log(Model.length);
    res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
    data: doc
    }
    });
});
exports.getOne = (Model, populateQuery) => tryCatch(async (req,res,next) => {
    //adding populate for referencing
    let query =  Model.findById(req.params.id);
    console.log(populateQuery);
    if(populateQuery) query = query.populate(populateQuery);
    const doc = await query;
	if(!doc){
		return next(new catchError('no Document was found', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			data: doc
		}
    });
});
exports.CreateOne = Model => tryCatch(async (req,res,next) =>{
	
    const doc =  new Model(req.body);
	await doc.save();
	res.status(200).json({
		ststus: 'success',
		data: {
		data: doc
		}
    });
});
exports.updateOne = Model => tryCatch(async (req,res,next) => {
    const doc  = await Model.findByIdAndUpdate(req.params.id,
        req.body,{ new: true, runValidators: true});
    if(!doc){
        return next(new catchError('no Document was found', 404));
    }

    res.status(200).json({
    status: 'success',
    data: {
        data: doc
    }
});

});