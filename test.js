const _ = require('./index');

const log = (...data) => console.log(...data);

//_.map
log(_.map([1,2,3], v => v * 2));

log(_.map({a: 3, b: 2, c: 1}, v => v * 2));

log(_.map([1,2,3], (v => v * 2).bind(5)));

//_.values
log(_.values({id: 5, name: "JE", age: 27}));

//_.keys
log(_.keys([3, 2, 1]));

log(_.keys({id: 5, name: "JE", age: 27}));

log(_.keys(10));

log(_.keys(null));

//_.each
_.each([1,2,3], log);

_.each({id: 5, name: "JE", age: 27}, log);


//_.filter
log(_.filter([1, 2, 3, 4], val => val > 2));

log(_.filter({a: 1, b: 2, c: 3, d: 4}, val => val < 3));

//_.rest
log(_.rest([1, 2, 3]));

log(_.rest({0: 1, 1: 10, 2: 100, 3: 1000, length: 4}, 2));

//_.reverse
log(_.reverse([1, 2, 3]));

log(_.reverse({}));

log(_.reverse(null));

log(_.rest(_.reverse({0: 1, 1: 10, 2: 100, 3: 1000, length: 4})));

//_.rester
const sum = (a,b,c,d) => ((a||0)+(b||0)+(c||0)+(d||0));
log(_.rester(sum)(1, 2, 3, 4));

log(_.rester(sum, 2)(1, 2, 3, 4));

log(_.rester(sum, 3)(1, 2, 3, 4));

//_.if == _.safety == _.with_validtor
const sub = (a, b) => a - b;
const sub2 = _.if((a, b) => (a >= b), sub, (a, b) => (`Error -> ${a} is lesser than ${b}`));

log(sub2(10, 5));

log(sub2(2, 5));

const diff = _.if((a, b) => (a >= b), sub, (a, b) => sub(b, a));

log(diff(2, 5));

const square = _.safety(_.isNumber, a => a * a, () => 0);

log(square(5));

log(square("가나다"));

//_.toArray2
log(_.toArray2([1, 2, 3]));

log(_.toArray2({0: 1, 1: 10, 2: 100, 3: 1000, length: 4}));

//_.reject
log(_.reject([1, 2, 3, 4], v => v <= 2));

//_.find
log(_.find([1, 10, 100, 1000], v => v > 50));

log(_.find([{id: 2, name: "HA", age: 25}, 
            {id: 4, name: "PJ", age: 28}, 
            {id: 5, name: "JE", age: 27}], user => user.age == 27));

//_.findIndex
log(_.findIndex([1, 10, 100, 1000], v => v > 50));

log(_.findIndex([1, 10, 100, 1000], v => v > 1000));

//_.findKey
log(_.findKey({id: 4, name: "PJ", age: 28}, val => typeof val == 'string'));

log(_.findKey({id: 4, name: "PJ", age: 28}, Array.isArray));

//_.some
log(_.some([false, null, 10, undefined], Number.isInteger));

log(_.some([false, null, 10, undefined]));

//_.every
log(_.every([false, null, true, undefined], _.not));

log(_.every([false, null, true, undefined]));

log(_.every([() => {}, {}, [], {}], _.isObject));

log(_.every([() => {}, {}, [], {}]));

//_.reduce
log(_.reduce([1, 2, 3], (memo, val, idx, list) => memo + val, 0));

log(_.reduce([[0, 1], [2, 3], [4, 5]], (memo, val, idx, list) => memo.concat(val), []));

const users = [
    {id: 1, name: "ID", age: 32},
    {id: 2, name: "HA", age: 25},
    {id: 3, name: "BJ", age: 32},
    {id: 4, name: "PJ", age: 28},
    {id: 5, name: "JE", age: 27},
    {id: 6, name: "JM", age: 32},
    {id: 7, name: "HI", age: 24},
];

log(_.reduce(users, (memo, user) => {
    if(user.age >= 30) memo.push(user.name);
    return memo;
}, []));

log(_.reduce(users, (memo, user) => {
    const group = user.age - (user.age % 10);
    memo.count[group] = (memo.count[group] || 0) + 1;
    memo.total[group] = (memo.total[group] || 0) + user.age;
    return memo;
}, {count: {}, total: {}}));