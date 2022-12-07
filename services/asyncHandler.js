// in controller many method will call the database so we have to write async await each time database call is there so creating a asynchandler so that we dont want to repeat async awiat 

// here taking function as a parameter{function of contoller so that it will acts as a async }
const asyncHandler = (fn) => async (req, res , next) => {
    // here adding try catch block so that any request come will go through try catch block 
    try {
        await fn(req, res, next)
    } catch (err) {
        res.status(err.code || 500).json({
            sucess:false,
            message:err.message
        });
    }
};



export default asynchandler;

/*
    higher order function
    simple arow function
  const asyncHandler = () => {};

  passing function{fn} as a paramater  
  const asynchandler = (fn) => {};

  passing this function to another function
  const asyncHandler = (fn) => () => {};

  and making the another function as a async function 
  const asynchandler = (fn) => async() => {}; 

 function asyncHandler  (fn) {
    return async function (req, res, next){
        try{

        }catch(err){
            res.status(err.code||500).json(
                {
                    sucess:false,
                    message:err.message
                }
            );
        }
    }
 }




*/