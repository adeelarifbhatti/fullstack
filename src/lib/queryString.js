class APIFeatures {
	constructor(query, queryString){
		this.query = query;
		this.queryString = queryString;

	}
	editing()
	{
		const queryObj = {...this.queryString};
		const excludingValues = ['page','sort','limit','fields'];
		excludingValues.forEach(el=>delete queryObj[el]);

		//converting the javascript object to string
		let qString = JSON.stringify(queryObj);
		//regex for changing the gte to $gte
		qString = qString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		console.log("#####Query in the URL######  ", queryObj, qString);

		// JSON.parse(qString) will convert the text in to javascript object
		 this.query =  this.query.find(JSON.parse(qString));
		 return this;
	}
	sorting(){
		if (this.queryString.sort){
			console.log("## Sorting########### ",this.query.sort);
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
			console.log("## Sorting########### ",sortBy);
		}
		//default sorting
		else {
			this.query = this.query.sort('-duration');
		}
		return this;
	}
	fields(){
		if(this.queryString.fields){
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		}
		else{
			this.query = this.query.select('-__v');
		}
		return this;
	}
	paginate(){
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 4;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		/*if(req.query.page){
			const  numCourses = await Course.countDocuments();
			console.log("numCourses ", numCourses, "skip ", skip );
			if(skip > numCourses) throw new Error('This page does not exist');

		}*/
		return this;
	}

}
module.exports= APIFeatures;