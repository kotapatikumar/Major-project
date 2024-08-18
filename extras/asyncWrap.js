
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

//Both are same;

// function asyncWrap(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports=asyncWrap;