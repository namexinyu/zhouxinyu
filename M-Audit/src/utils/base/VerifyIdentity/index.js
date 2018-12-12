function idCard15To18(id) {
    let W = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    let A = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let i = 0;
    let j = 0;
    let s = 0;
    let newid;
    newid = id;
    newid = newid.substring(0, 6) + "19" + newid.substring(6, id.length);
    for (i = 0; i < newid.length; i++) {
        j = parseInt(newid.substring(i, i + 1), 10) * W[i];
        s = s + j;
    }
    s = s % 11;
    newid = newid + A[s];
    return newid;
}
function veriIdentity(arrIdCard) {
    if (arrIdCard.length == 0) {
        return false;
    }
    if (arrIdCard.length == 15) {
        arrIdCard = idCard15To18(arrIdCard);
    }
    let sigma = 0;
    let a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let w = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let w2 = ["1", "0", "x", "9", "8", "7", "6", "5", "4", "3", "2"];
    for (let i = 0; i < 17; i++) {
        let ai = parseInt(arrIdCard.substring(i, i + 1), 10);
        let wi = a[i];
        sigma += ai * wi;
    }
    let number = sigma % 11;
    let check_number = w[number];
    let check_number2 = w2[number];
    if (arrIdCard.substring(17) == check_number || arrIdCard.substring(17) == check_number2) {
        return true;
    }
    return false;
}

export default veriIdentity;