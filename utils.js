const hexConverter = (decimal, defaultOpacity="d9") => {
    const hexMap = {
        0 : "0",
        1 : "1",
        2 : "2",
        3 : "3",
        4 : "4",
        5 : "5",
        6 : "6",
        7 : "7",
        8 : "8",
        9 : "9",
        10 : "A",
        11 : "B",
        12 : "C",
        13 : "D",
        14 : "E",
        15 : "F"
    }
    const addOpacity = ( hexColor) => {
        const alphaVal = defaultOpacity;
        return hexColor + alphaVal

    }
    var q = 1;
    var r;
    let hexArray = [];
    let hexString = "#";
    while( q != 0){
        q = Math.floor(decimal / 16)
        r = decimal % 16;
        decimal = q;
        hexArray.push(hexMap[r])
    }

    if( hexArray.length > 0){
        for(let i = 0; i < hexArray.length - 6; i++){
            hexString += "0"
        }
        for (let hexVal of hexArray.reverse()){
            hexString += hexVal
        }
    }
    return addOpacity(hexString)
}