const Product = require('../models/product')

const getAllProductsStatic = async function(req, res) {
    const products = await Product.find({}).sort('-name price')
    res.status(200).json({ products, nbHits: products.lenght })
}
const getAllProducts = async function(req, res) {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $option: 'i' }
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$et',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regEx, function (match) {
            `-${operatorMap[match]}-`
        })
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach(function(item) {
            const [field, operator, value] = item.spli('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    let result = Product.find(req.query)
    if (sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortlist)
    } else {
        result = result.sort('createdAt')
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldslist)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({ products, nbHits: products.lenght})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}