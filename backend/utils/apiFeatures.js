//to search the product using keyword, price, 
class Apifeatures {
    constructor(query, querystr){
        this.query = query; //to get the product as a object
        this.querystr = querystr; //to get the req parameter for keyword =  " ? "
      
    }
    search(){
        let keyword = this.querystr.keyword ? {
            name:{
                $regex: this.querystr.keyword,//monodb query property = regex is used to search the keyword from the product
                $options:'i'//case insensitivity
            }
        }:{};
        this.query.find({...keyword})
   
        return this;
    }

    filter(){
        const querystrcopy = {...this.querystr};
        //before
       // console.log(querystrcopy);
        //removing fileds from query
        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(field =>
            {delete querystrcopy[field]});
        //after
       // console.log(querystrcopy);
    

        let querystr = JSON.stringify(querystrcopy);//to convert into json format 
       querystr =  querystr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`); //to replace into $
      
       this.query.find(JSON.parse(querystr));//to convert string into object 
       return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.querystr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip)//limit to give the information about how many data in per page 
        return this;
    }
}

module.exports = Apifeatures;