class Util {

static chunk (array, chunkSize){

    const temp = [];

    for(let i = 0; i < array.length; i+= chunkSize){

      temp.push(array.slice(i, i+chunkSize));

    }

    return temp;

  }

 } 

module.exports = Util;
