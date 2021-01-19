const tryCatch = require('./../lib/tryCatch');
const catchError = require('./../lib/appErrors');

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