class ApiFeatures {
    constructor( query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            }
        }:{};
        this.query = this.query.find({...keyword})
        return this
    }
    filter(){
        const queryCopy = {...this.queryStr}
        // Remove some fields for the query
        const removeFields = ['keyword','page','limit'];
        removeFields.forEach(key => delete queryCopy[key])

        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultsPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultsPerPage * (currentPage - 1)
        this.query = this.query.limit(resultsPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures